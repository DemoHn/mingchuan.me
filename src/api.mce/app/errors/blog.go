package errors

import (
	"fmt"
)

// post, type = 101

// SQLExecutionError -
func SQLExecutionError(err error) *Error {
	return &Error{
		Name:       "SQLExecution",
		ErrorCode:  10101,
		StatusCode: 400,
		Detail:     err.Error(),
	}
}

// ArticleIDNotFoundError -
func ArticleIDNotFoundError(ID uint32) *Error {
	return &Error{
		Name:       "ArticleIDNotFound",
		ErrorCode:  10102,
		StatusCode: 400,
		Detail:     fmt.Sprintf("Article ID(%d) not found", ID),
	}
}

// NoAccessToArticleIDError -
func NoAccessToArticleIDError(ID uint32) *Error {
	return &Error{
		Name:       "NoAccessToArticle",
		ErrorCode:  10103,
		StatusCode: 401,
		Detail:     fmt.Sprintf("No access to Article ID(%d)", ID),
	}
}

// NewPostValidationError -
func NewPostValidationError(info string) *Error {
	return &Error{
		Name:       "NewPostValidation",
		ErrorCode:  10104,
		StatusCode: 401,
		Detail:     info,
	}
}

// NotDraftedPostError -
func NotDraftedPostError() *Error {
	return &Error{
		Name:       "NewPostValidation",
		ErrorCode:  10105,
		StatusCode: 401,
		Detail:     "Invalid article status, only Drafted is allowed",
	}
}
