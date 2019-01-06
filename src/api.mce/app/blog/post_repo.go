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
