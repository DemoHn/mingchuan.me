package blog

import (
	"time"
)

/* filters */
// ArticlePageFilter - page filter
type ArticlePageLimit struct {
	Offset int64 // -1 for not work
	Limit  int64
}

// ArticleOrderFilter - show article order
type ArticleOrder struct {
	// TODO:
	CreatedAt *string // "asc" or "desc" or nil
	UpdatedAt *string // "asc" or "desc" or nil
}

// ArticleFilter - filters to control list articles
type ArticleFilter struct {
	// optional
	Status *ArticleStatus
	// optional
	Permission *ArticlePermission
}

/* models */
// Article - manage article list and content
type Article struct {
	ID uint32 `gorm:"primary_key" json:"id"`
	// Title - aritle title
	Title string `gorm:"type:text; not null" json:"title"`
	// Content - article content
	Content string `gorm:"type:text" json:"content"`
	// Status - if article is published or other state
	Status ArticleStatus `json:"status"`
	// Permission - if article is private or public
	Permission ArticlePermission `json:"permission"`
	// TODO fields
	// Tag: article tags
	// LanguageID: language ID
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ArticleUpdatePayload
type ArticleUpdatePayload struct {
	Title      *string
	Content    *string
	Status     *string
	Permission *string
}

// ArticleEventLog - article event log
type ArticleEventLog struct {
	ID            uint32
	ArticleID     uint32
	ArticleEvent  ArticleEvent
	NewStatus     ArticleStatus
	NewPermission ArticlePermission
	CreatedAt     time.Time
	UpdatedAt     time.Time
	// optional: UserID
}

const (
	// DefaultLimitValue -
	DefaultLimitValue int64 = 10
)
