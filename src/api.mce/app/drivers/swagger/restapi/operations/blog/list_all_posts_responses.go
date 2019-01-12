// Code generated by go-swagger; DO NOT EDIT.

package blog

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	models "mingchuan.me/app/drivers/swagger/models"
)

// ListAllPostsOKCode is the HTTP code returned for type ListAllPostsOK
const ListAllPostsOKCode int = 200

/*ListAllPostsOK success

swagger:response listAllPostsOK
*/
type ListAllPostsOK struct {

	/*
	  In: Body
	*/
	Payload *models.PostsListOfPage `json:"body,omitempty"`
}

// NewListAllPostsOK creates ListAllPostsOK with default headers values
func NewListAllPostsOK() *ListAllPostsOK {

	return &ListAllPostsOK{}
}

// WithPayload adds the payload to the list all posts o k response
func (o *ListAllPostsOK) WithPayload(payload *models.PostsListOfPage) *ListAllPostsOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the list all posts o k response
func (o *ListAllPostsOK) SetPayload(payload *models.PostsListOfPage) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *ListAllPostsOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// ListAllPostsBadRequestCode is the HTTP code returned for type ListAllPostsBadRequest
const ListAllPostsBadRequestCode int = 400

/*ListAllPostsBadRequest service error

swagger:response listAllPostsBadRequest
*/
type ListAllPostsBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewListAllPostsBadRequest creates ListAllPostsBadRequest with default headers values
func NewListAllPostsBadRequest() *ListAllPostsBadRequest {

	return &ListAllPostsBadRequest{}
}

// WithPayload adds the payload to the list all posts bad request response
func (o *ListAllPostsBadRequest) WithPayload(payload *models.ServiceError) *ListAllPostsBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the list all posts bad request response
func (o *ListAllPostsBadRequest) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *ListAllPostsBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// ListAllPostsInternalServerErrorCode is the HTTP code returned for type ListAllPostsInternalServerError
const ListAllPostsInternalServerErrorCode int = 500

/*ListAllPostsInternalServerError service error (fatal)

swagger:response listAllPostsInternalServerError
*/
type ListAllPostsInternalServerError struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewListAllPostsInternalServerError creates ListAllPostsInternalServerError with default headers values
func NewListAllPostsInternalServerError() *ListAllPostsInternalServerError {

	return &ListAllPostsInternalServerError{}
}

// WithPayload adds the payload to the list all posts internal server error response
func (o *ListAllPostsInternalServerError) WithPayload(payload *models.ServiceError) *ListAllPostsInternalServerError {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the list all posts internal server error response
func (o *ListAllPostsInternalServerError) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *ListAllPostsInternalServerError) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(500)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}