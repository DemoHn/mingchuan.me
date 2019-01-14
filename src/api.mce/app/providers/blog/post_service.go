package blog

import (
	"fmt"
	"strconv"

	"mingchuan.me/app/drivers/gorm"

	"mingchuan.me/util"

	"mingchuan.me/app/errors"
)

// PostValidations -
type PostValidations struct {
	MaxTitleChars   uint32
	MaxArticleChars uint32
}

// PostService - post service main data struct
type PostService struct {
	DB *gorm.Driver
	*PostRepo
	Validations PostValidations
}

const (
	maxTitleChars   = 120
	maxArticleChars = 120000
)

// NewPostService - new blog service object
func NewPostService(db *gorm.Driver) (*PostService, error) {
	var err error
	if err = db.AutoMigrate(&Article{}).Error(); err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(&ArticleEventLog{}).Error(); err != nil {
		return nil, err
	}

	return &PostService{
		DB:       db,
		PostRepo: NewPostRepo(db),
		// Hardcore version number
		// init validations
		Validations: PostValidations{
			MaxTitleChars:   maxTitleChars,
			MaxArticleChars: maxArticleChars,
		},
	}, nil
}

// CreatePost - create a new post
func (p *PostService) CreatePost(
	title string,
	content string,
	initialStatus ArticleStatus,
	initialPermission ArticlePermission) (Article, *errors.Error) {
	var newPost Article
	var err error
	// check validation
	if errV := p.validateNewPost(title, content, initialStatus); errV != nil {
		return newPost, errV
	}

	newPost = Article{
		Title:      title,
		Content:    content,
		Status:     initialStatus,
		Permission: initialPermission,
	}

	if err = p.PostRepo.Create(&newPost); err != nil {
		return newPost, errors.SQLExecutionError(err)
	}

	return newPost, nil
}

// UpdatePost - update content of a post
func (p *PostService) UpdatePost(ID uint32, payload *ArticleUpdatePayload) (*Article, *errors.Error) {
	// TODO
	db := p.DB
	var article Article
	db = db.Where("id = ?", ID).First(&article)
	if db.Error() != nil {
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
	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	return &article, nil
}

// DeletePost - delete a post
// Notice, we will not delete a post from db directly
func (p *PostService) DeletePost(ID uint32) *errors.Error {
	// validate if ID exists
	var article Article
	var err error
	// not found
	if err = p.DB.Where("id = ?", ID).First(&article).Error(); err != nil {
		return errors.ArticleIDNotFoundError(ID)
	}

	if err = p.PostRepo.Delete(&article); err != nil {
		return errors.SQLExecutionError(err)
	}
	return nil
}

// PublishPost - publish a drafted post
// NOTICE: only status = DRAFTED could do this operation
func (p *PostService) PublishPost(ID uint32) (*Article, *errors.Error) {
	// 0. validate if it exists and status = DRAFTED
	var article Article
	var err error
	// not found
	if err = p.DB.Where("id = ?", ID).First(&article).Error(); err != nil {
		return nil, errors.SQLExecutionError(err)
	}
	// status != DRAFTED
	if article.Status != Drafted {
		return nil, errors.NotDraftedPostError()
	}

	if err = p.PostRepo.UpdateStatus(&article, Published, PublishPost); err != nil {
		return nil, errors.SQLExecutionError(err)
	}
	return &article, nil
}

// GetOnePost - get one post
func (p *PostService) GetOnePost(ID uint32) (Article, *errors.Error) {
	var article Article
	if err := p.DB.Find(&article, "id = ?", ID).Error(); err != nil {
		return article, errors.ArticleIDNotFoundError(ID)
	}

	return article, nil
}

// GetOnePublicPost - get one post (public to be seen)
func (p *PostService) GetOnePublicPost(ID uint32) (*Article, *errors.Error) {
	var article Article
	db := p.DB

	if err := db.Find(&article, "id = ?", ID).Error(); err != nil {
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
func (p *PostService) ListAllPostsByPage(page *int64, limit *int64) (int64, []Article, *errors.Error) {
	// TODO add sorting
	var articles []Article
	var err error
	db := p.DB

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
func (p *PostService) ListPublicPostsByCursor(cursor *string, limit *int64) (bool, string, []Article, *errors.Error) {
	db := p.DB
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
func (p *PostService) validateNewPost(
	title string,
	content string,
	status ArticleStatus) *errors.Error {

	// Rule #1
	maxTitleChars := p.Validations.MaxTitleChars
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
	maxContentChars := p.Validations.MaxArticleChars
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
	db *gorm.Driver,
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
	if err = db.Find(&articles).Error(); err != nil {
		articles = nil
	}
	return
}
