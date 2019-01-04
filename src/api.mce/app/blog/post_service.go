package blog

import (
	"fmt"
	"strconv"
	"time"

	"mingchuan.me/util"

	"github.com/jinzhu/gorm"
	"mingchuan.me/app/errors"
)

// CreatePost - create a new post
func (blog *BlogService) CreatePost(
	title string,
	content string,
	initialStatus ArticleStatus,
	initialPermission ArticlePermission) (Article, *errors.Error) {
	var newPost Article
	var err error
	// check validation
	if errV := blog.validateNewPost(title, content, initialStatus); errV != nil {
		return newPost, errV
	}
	// create transaction
	finish := false
	tx := blog.DB.Begin()
	defer func() {
		if finish != true {
			tx.Rollback()
		}
	}()
	// error checking
	if tx.Error != nil {
		return newPost, errors.SQLExecutionError(tx.Error)
	}
	// 1. create post
	newPost = Article{
		Title:      title,
		Content:    content,
		Status:     initialStatus,
		Permission: initialPermission,
	}
	if err = tx.Create(&newPost).Error; err != nil {
		return newPost, errors.SQLExecutionError(err)
	}
	// 2. create event log
	var articleEvent ArticleEvent
	switch initialStatus {
	case Published:
		articleEvent = PublishPost
	default:
		articleEvent = SaveDraft
	}

	newEvent := ArticleEventLog{
		ArticleID:     newPost.ID,
		ArticleEvent:  articleEvent,
		NewStatus:     initialStatus,
		NewPermission: initialPermission,
		CreatedAt:     time.Now(),
	}
	if err = tx.Create(&newEvent).Error; err != nil {
		return newPost, errors.SQLExecutionError(err)
	}

	if err = tx.Commit().Error; err != nil {
		return newPost, errors.SQLExecutionError(err)
	}

	finish = true
	return newPost, nil
}

// UpdatePost - update content of a post
func (blog *BlogService) UpdatePost(ID uint32, payload *ArticleUpdatePayload) (*Article, *errors.Error) {
	// TODO
	db := blog.DB
	var article Article
	db = db.Where("id = ?", ID).First(&article)
	if db.Error != nil {
		return nil, errors.ArticleIDNotFoundError(ID)
	}

	if payload.Content != nil {
		article.Content = *(payload.Content)
	}
	if payload.Title != nil {
		article.Title = *(payload.Title)
	}
	if payload.Status != nil {
		article.Status = *(payload.Status)
	}
	if payload.Permission != nil {
		article.Permission = *(payload.Permission)
	}
	db = db.Save(&article)
	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	return &article, nil
}

// DeletePost - delete a post
// Notice, we will not delete a post
func (blog *BlogService) DeletePost(ID uint32) *errors.Error {
	// validate if ID exists
	var article Article
	var err error
	// not found
	if err = blog.DB.Where("id = ?", ID).First(&article).Error; err != nil {
		return errors.ArticleIDNotFoundError(ID)
	}

	// Delete that post
	// and create transaction
	finish := false
	tx := blog.DB.Begin()
	if tx.Error != nil {
		return errors.SQLExecutionError(tx.Error)
	}
	defer func() {
		if finish == false {
			tx.Rollback()
		}
	}()

	// 1. Update post to DELETED
	if err = tx.Model(&article).Update("status", Removed).Error; err != nil {
		return errors.SQLExecutionError(tx.Error)
	}
	// 2. and register event log
	newEvent := ArticleEventLog{
		ArticleID:     article.ID,
		ArticleEvent:  DeletePost,
		NewStatus:     Removed,
		NewPermission: article.Permission,
		CreatedAt:     time.Now(),
	}
	if err = tx.Create(&newEvent).Error; err != nil {
		return errors.SQLExecutionError(err)
	}

	// 3. commit
	if err = tx.Commit().Error; err != nil {
		return errors.SQLExecutionError(err)
	}

	finish = true
	return nil
}

// PublishPost - publish a drafted post
// NOTICE: only status = DRAFTED could do this operation
func (blog *BlogService) PublishPost(ID uint32) (*Article, *errors.Error) {
	// 0. validate if it exists and status = DRAFTED
	var article Article
	var err error
	// not found
	if err = blog.DB.Where("id = ?", ID).First(&article).Error; err != nil {
		return nil, errors.SQLExecutionError(err)
	}
	// status != DRAFTED
	if article.Status != Drafted {
		return nil, errors.NotDraftedPostError()
	}

	// 1. update status
	finish := false
	tx := blog.DB.Begin()
	if tx.Error != nil {
		return nil, errors.SQLExecutionError(tx.Error)
	}
	defer func() {
		if finish == false {
			tx.Rollback()
		}
	}()

	if err = tx.Model(&article).Update("status", Published).Error; err != nil {
		return nil, errors.SQLExecutionError(err)
	}
	// 2. and register event log
	newEvent := ArticleEventLog{
		ArticleID:     article.ID,
		ArticleEvent:  PublishPost,
		NewStatus:     Published,
		NewPermission: article.Permission,
		CreatedAt:     time.Now(),
	}
	if err = tx.Create(&newEvent).Error; err != nil {
		return nil, errors.SQLExecutionError(err)
	}

	// 3. commit
	if err = tx.Commit().Error; err != nil {
		return nil, errors.SQLExecutionError(err)
	}
	finish = true
	return &article, nil
}

// GetOnePost - get one post
func (blog *BlogService) GetOnePost(ID uint32) (Article, *errors.Error) {
	var article Article
	if err := blog.DB.Find(&article, "id = ?", ID).Error; err != nil {
		return article, errors.ArticleIDNotFoundError(ID)
	}

	return article, nil
}

// GetOnePublicPost - get one post (public to be seen)
func (blog *BlogService) GetOnePublicPost(ID uint32) (*Article, *errors.Error) {
	var article Article
	db := blog.DB

	if err := db.Find(&article, "id = ?", ID).Error; err != nil {
		return nil, errors.ArticleIDNotFoundError(ID)
	}

	// check if article is public & published
	if article.Permission != Public || article.Status != Published {
		return nil, errors.NoAccessToArticleIDError(ID)
	}

	return &article, nil
}

// ListAllPostsByPage - list all posts for admin panel, including DRAFTED, PUBLISHED, REMOVED
// This is usually used in admin panel
// returns: page(bool), articles(Array<Article>), error
func (blog *BlogService) ListAllPostsByPage(page *int64, limit *int64) (int64, []Article, *errors.Error) {
	// TODO add sorting
	var articles []Article
	var err error
	db := blog.DB

	// get actuall limit
	var aLimit int64
	var aPage int64
	var aOffset int64

	if limit != nil {
		aLimit = *limit
		if aLimit > DefaultLimitValue {
			aLimit = DefaultLimitValue
		}
	} else {
		aLimit = DefaultLimitValue
	}

	if page != nil {
		aPage = *page
		aOffset = (*page)*aLimit - aLimit
	} else {
		aPage = 1
		aOffset = 0
	}
	pageLimit := &ArticlePageLimit{
		Limit:  aLimit,
		Offset: aOffset,
	}

	odesc := "desc"
	articleOrder := &ArticleOrder{
		UpdatedAt: &odesc,
	}

	articles, err = listPostsWithFilters(db, nil, pageLimit, articleOrder)
	if err != nil {
		return 0, articles, errors.SQLExecutionError(err)
	}
	return aPage, articles, nil
}

// ListPublicPostsByCursor - list posts by cursor
// used in blog main page to show all blog posts
func (blog *BlogService) ListPublicPostsByCursor(cursor *string, limit *int64) (bool, string, []Article, *errors.Error) {
	db := blog.DB
	var articles []Article

	// enusre only published & public posts will be shown
	filter := &ArticleFilter{
		Status:     util.String(Published),
		Permission: util.String(Public),
	}
	// get actaul limt
	var aLimit int64
	if limit != nil {
		aLimit = *limit
		if aLimit > DefaultLimitValue {
			aLimit = DefaultLimitValue
		}
	} else {
		aLimit = DefaultLimitValue
	}

	// get cursor
	if cursor != nil {
		db = db.Where("id < ?", *cursor)
	}
	// order id = desc
	db = db.Order("id desc")
	// add 1 to calculate if hasMOre is true or not
	db = db.Limit(aLimit + 1)
	articles, err := listPostsWithFilters(db, filter, nil, nil)

	if err != nil {
		return false, "", articles, errors.SQLExecutionError(err)
	}

	var hasMore bool
	var fCursor string
	hasMore = true
	// calculate if hasMore
	if len(articles) < int(aLimit+1) {
		hasMore = false
	}
	// get cursor
	if hasMore == true {
		// remove last one
		articles = articles[:len(articles)-1]
		fCursor = strconv.Itoa(int(articles[len(articles)-1].ID))
	}

	return hasMore, fCursor, articles, nil
}

// common functions
/**
Rule #1: len(title) < maxTitleLength
Rule #1.1: len(title) > 0
Rule #2: len(contet) < maxContentLength
Rule #3: state in [Published, ]
*/
func (blog *BlogService) validateNewPost(
	title string,
	content string,
	status ArticleStatus) *errors.Error {

	// Rule #1
	maxTitleChars := blog.Validations.MaxTitleChars
	if uint32(len([]rune(title))) >= maxTitleChars {
		return errors.NewPostValidationError(
			fmt.Sprintf("The length of title has exceed limit:%d chars", maxTitleChars),
		)
	}

	// Rule #1.1
	if len([]rune(title)) == 0 {
		return errors.NewPostValidationError(
			fmt.Sprintf("Title cannot be null"),
		)
	}
	// Rule #2
	maxContentChars := blog.Validations.MaxArticleChars
	if uint32(len([]rune(content))) >= maxContentChars {
		return errors.NewPostValidationError(
			fmt.Sprintf("The length of content has exceed limit:%d chars", maxContentChars),
		)
	}

	// Rule #3
	notFound := true
	var availStatus = []ArticleStatus{Published, Drafted}
	for _, s := range availStatus {
		if s == status {
			notFound = false
			break
		}
	}

	if notFound == true {
		return errors.NewPostValidationError(
			fmt.Sprintf("Status %s not available", status),
		)
	}
	// all passed
	return nil
}

/**
List Posts with filters
We only support two kinds of filters: status fitler and page filter
1) status filter: PUBLISHED | DRAFTED | REMOVED
2) page filter: page, limit
*/
func listPostsWithFilters(
	// db - gorm database connection.
	// for parsing more conditions, add `Where()` clause on this method
	// before passing into the function.
	db *gorm.DB,
	// filter - article status and permission filter
	filter *ArticleFilter,
	pageLimit *ArticlePageLimit,
	order *ArticleOrder,
) (articles []Article, err error) {
	// add status filter
	if filter != nil {
		if filter.Status != nil {
			db = db.Where("status = ?", *(filter.Status))
		}
		if filter.Permission != nil {
			db = db.Where("permission = ?", *(filter.Permission))
		}
	}
	// add page filter
	if pageLimit != nil {
		db = db.Limit(pageLimit.Limit).Offset(pageLimit.Offset)
	}

	if order != nil {
		if order.CreatedAt != nil {
			db = db.Order(fmt.Sprintf("created_at %s", *order.CreatedAt))
		}

		if order.UpdatedAt != nil {
			db = db.Order(fmt.Sprintf("updated_at %s", *order.UpdatedAt))
		}
	}

	// do search
	if err = db.Find(&articles).Error; err != nil {
		articles = nil
	}
	return
}
