package errors

import (
	"encoding/json"
	"fmt"
)

// Error - morloop base error
type Error struct {
	Name       string `json:"name"`
	StatusCode int    `json:"-"`
	ErrorCode  int    `json:"code"`
	Detail     string `json:"detail"`
}

// Error - format and show error
// this is to ensure it could be regarded as internal `error`
func (err *Error) Error() string {
	return ""
}

// GetName - get error name
func (err *Error) GetName() string {
	return err.Name
}

// GetStatusCode - get statusCode [200, 404, etc.]
func (err *Error) GetStatusCode() int {
	return err.StatusCode
}

// GetErrorCode - error code
func (err *Error) GetErrorCode() int {
	return err.ErrorCode
}

// GetDetail - err detail
func (err *Error) GetDetail() string {
	return err.Detail
}

// ToJSON - transform to JSON
func (err *Error) ToJSON() ([]byte, error) {
	return json.Marshal(err)
}

// Some common errors

// You can also take it for reference
// UnknownError - mother of errors
func UnknownError(err error) *Error {
	return &Error{
		Name:       "UnknownError",
		StatusCode: 500,
		ErrorCode:  10000,
		Detail:     err.Error(),
	}
}

// APINotImplementedError -
func APINotImplementedError(api string) *Error {
	return &Error{
		Name:       "APINotImplemented",
		StatusCode: 500,
		ErrorCode:  10001,
		Detail:     fmt.Sprintf("API(%s) not implemented!", api),
	}
}

// JSONParseError - 500
func JSONParseError(err error) *Error {
	return &Error{
		Name:       "JSONParseError",
		StatusCode: 500,
		ErrorCode:  10002,
		Detail:     err.Error(),
	}
}

// ResourceNotFoundError - 404
func ResourceNotFoundError(method string, route string) *Error {
	return &Error{
		Name:       "ResourceNotFoundError",
		StatusCode: 404,
		ErrorCode:  10003,
		Detail:     fmt.Sprintf("Resource `[%s] %s` not found", method, route),
	}
}

// AuthSchemaValidationError - happens if `Auth-Schema` Header is invalid
func AuthSchemaValidationError(inputSchema string, allowedSchema []string) *Error {
	return &Error{
		Name:       "AuthSchemaValidationError",
		StatusCode: 401,
		ErrorCode:  10100,
		Detail:     fmt.Sprintf("Invalid auth-schema: %s, only %s are allowed", inputSchema, allowedSchema),
	}
}

// AuthKeyValidationError - invalid JWT key
func AuthKeyValidationError(err error) *Error {
	return &Error{
		Name:       "AuthKeyValidationError",
		StatusCode: 401,
		ErrorCode:  10101,
		Detail:     err.Error(),
	}
}
