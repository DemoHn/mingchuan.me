package swagger

import (
	"mingchuan.me/app/drivers/swagger/models"
	"mingchuan.me/app/errors"
)

// models.go
// This file wraps some common swagger models
// TODO: use formatters to help replce this file!

// ModelServiceError -
func ModelServiceError(err *errors.Error) *models.ServiceError {
	errCode := int64(err.ErrorCode)
	return &models.ServiceError{
		Name:   &(err.Name),
		Code:   &errCode,
		Detail: &(err.Detail),
	}
}
