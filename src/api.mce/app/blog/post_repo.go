package blog

import (
	"time"

	"github.com/jinzhu/gorm"
)

// PostRepo - post repository
type PostRepo struct {
	*gorm.DB
}

type txCallback func(tx *gorm.DB) error

// ArticleStatus - define all states of an article
type ArticleStatus = string

const (
	// Published -
	Published ArticleStatus = "PUBLISHED"
	// Drafted -
	Drafted ArticleStatus = "DRAFTED"
	// Removed -
	Removed ArticleStatus = "REMOVED"
)

// ArticlePermission - all permissions that an article have
type ArticlePermission = string

const (
	// Public - can be seen by everyone
	Public ArticlePermission = "PUBLIC"
	// Private - can be seen only by owner
	Private ArticlePermission = "PRIVATE"
)

// ArticleEvent - consts on article events
type ArticleEvent = string

const (
	// Change Status Events
	// SaveDraft -
	SaveDraft ArticleEvent = "SAVE_DRAFT" // status = DRAFTED
	// PublishPost -
	PublishPost ArticleEvent = "PUBLISH_POST" // status = PUBLISHED
	// DeletePost -
	DeletePost ArticleEvent = "DELETE_POST" // status = REMOVED
	// Change Permission Events
	// SetPublic -
	SetPublic ArticleEvent = "SET_PUBLIC" // permission = PUBLIC
	// SetPrivate -
	SetPrivate ArticleEvent = "SET_PRIVATE" // permission = PRIVATE
	// Other Events (That don't change status)
	// EditPost -
	EditPost ArticleEvent = "EDIT_POST"
)

// NewPostRepo -
func NewPostRepo(db *gorm.DB) *PostRepo {
	return &PostRepo{
		DB: db,
	}
}

// Create - create new post
func (r *PostRepo) Create(newPost *Article) error {
	return r.transaction(func(tx *gorm.DB) error {
		var err error
		// 1. insert post
		if err = tx.Create(newPost).Error; err != nil {
			return err
		}
		// 2. write event log
		var articleEvent ArticleEvent
		switch newPost.Status {
		case Published:
			articleEvent = PublishPost
		default:
			articleEvent = SaveDraft
		}

		newEvent := &ArticleEventLog{
			ArticleID:     newPost.ID,
			ArticleEvent:  articleEvent,
			NewStatus:     newPost.Status,
			NewPermission: newPost.Permission,
			CreatedAt:     time.Now(),
		}
		if err = tx.Create(&newEvent).Error; err != nil {
			return err
		}
		return nil
	})
}

// Delete - delete an existing post (soft delete)
func (r *PostRepo) Delete(post *Article) error {
	return r.transaction(func(tx *gorm.DB) error {
		var err error
		// set status -> Removed
		if err = tx.Model(post).Update("status", Removed).Error; err != nil {
			return err
		}

		// add event log
		newEvent := ArticleEventLog{
			ArticleID:     post.ID,
			ArticleEvent:  DeletePost,
			NewStatus:     Removed,
			NewPermission: post.Permission,
			CreatedAt:     time.Now(),
		}
		if err = tx.Create(&newEvent).Error; err != nil {
			return err
		}
		return nil
	})
}

// UpdateStatus - update post status with event log
func (r *PostRepo) UpdateStatus(post *Article, newStatus ArticleStatus, event ArticleEvent) error {
	return r.transaction(func(tx *gorm.DB) error {
		var err error
		if err = tx.Model(post).Update("status", newStatus).Error; err != nil {
			return err
		}
		// add event log
		newEvent := ArticleEventLog{
			ArticleID:     post.ID,
			ArticleEvent:  event,
			NewStatus:     newStatus,
			NewPermission: post.Permission,
			CreatedAt:     time.Now(),
		}
		if err = tx.Create(&newEvent).Error; err != nil {
			return err
		}
		return nil
	})
}

// helpers
func (r *PostRepo) transaction(fn txCallback) error {
	var finish = false
	var err error
	tx := r.Begin()
	defer func() {
		if finish != true {
			tx.Rollback()
		}
	}()
	if tx.Error != nil {
		return tx.Error
	}
	// execute
	if err = fn(tx); err != nil {
		return err
	}
	// commit
	if err = tx.Commit().Error; err != nil {
		return err
	}
	// finish transaction
	finish = true
	return nil
}
