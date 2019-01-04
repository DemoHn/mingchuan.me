package blog

import (
	"time"
)

// Types
type Nstring string

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
