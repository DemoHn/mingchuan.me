// Code generated by go-swagger; DO NOT EDIT.

package blog

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	models "mingchuan.me/app/drivers/swagger/models"
)

// UpdatePostOKCode is the HTTP code returned for type UpdatePostOK
const UpdatePostOKCode int = 200

/*UpdatePostOK success

swagger:response updatePostOK
*/
type UpdatePostOK struct {

	/*
	  In: Body
	*/
	Payload *models.Post `json:"body,omitempty"`
}

// NewUpdatePostOK creates UpdatePostOK with default headers values
func NewUpdatePostOK() *UpdatePostOK {

	return &UpdatePostOK{}
}

// WithPayload adds the payload to the update post o k response
func (o *UpdatePostOK) WithPayload(payload *models.Post) *UpdatePostOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update post o k response
func (o *UpdatePostOK) SetPayload(payload *models.Post) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdatePostOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// UpdatePostBadRequestCode is the HTTP code returned for type UpdatePostBadRequest
const UpdatePostBadRequestCode int = 400

/*UpdatePostBadRequest service error

swagger:response updatePostBadRequest
*/
type UpdatePostBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewUpdatePostBadRequest creates UpdatePostBadRequest with default headers values
func NewUpdatePostBadRequest() *UpdatePostBadRequest {

	return &UpdatePostBadRequest{}
}

// WithPayload adds the payload to the update post bad request response
func (o *UpdatePostBadRequest) WithPayload(payload *models.ServiceError) *UpdatePostBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update post bad request response
func (o *UpdatePostBadRequest) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdatePostBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// UpdatePostInternalServerErrorCode is the HTTP code returned for type UpdatePostInternalServerError
const UpdatePostInternalServerErrorCode int = 500

/*UpdatePostInternalServerError service error (fatal)

swagger:response updatePostInternalServerError
*/
type UpdatePostInternalServerError struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewUpdatePostInternalServerError creates UpdatePostInternalServerError with default headers values
func NewUpdatePostInternalServerError() *UpdatePostInternalServerError {

	return &UpdatePostInternalServerError{}
}

// WithPayload adds the payload to the update post internal server error response
func (o *UpdatePostInternalServerError) WithPayload(payload *models.ServiceError) *UpdatePostInternalServerError {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update post internal server error response
func (o *UpdatePostInternalServerError) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdatePostInternalServerError) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(500)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}