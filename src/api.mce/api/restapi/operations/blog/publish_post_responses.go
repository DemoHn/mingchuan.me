// Code generated by go-swagger; DO NOT EDIT.

package blog

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	models "mingchuan.me/api/models"
)

// PublishPostOKCode is the HTTP code returned for type PublishPostOK
const PublishPostOKCode int = 200

/*PublishPostOK success

swagger:response publishPostOK
*/
type PublishPostOK struct {

	/*
	  In: Body
	*/
	Payload *models.Post `json:"body,omitempty"`
}

// NewPublishPostOK creates PublishPostOK with default headers values
func NewPublishPostOK() *PublishPostOK {

	return &PublishPostOK{}
}

// WithPayload adds the payload to the publish post o k response
func (o *PublishPostOK) WithPayload(payload *models.Post) *PublishPostOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the publish post o k response
func (o *PublishPostOK) SetPayload(payload *models.Post) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PublishPostOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// PublishPostBadRequestCode is the HTTP code returned for type PublishPostBadRequest
const PublishPostBadRequestCode int = 400

/*PublishPostBadRequest service error

swagger:response publishPostBadRequest
*/
type PublishPostBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewPublishPostBadRequest creates PublishPostBadRequest with default headers values
func NewPublishPostBadRequest() *PublishPostBadRequest {

	return &PublishPostBadRequest{}
}

// WithPayload adds the payload to the publish post bad request response
func (o *PublishPostBadRequest) WithPayload(payload *models.ServiceError) *PublishPostBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the publish post bad request response
func (o *PublishPostBadRequest) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PublishPostBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// PublishPostInternalServerErrorCode is the HTTP code returned for type PublishPostInternalServerError
const PublishPostInternalServerErrorCode int = 500

/*PublishPostInternalServerError service error (fatal)

swagger:response publishPostInternalServerError
*/
type PublishPostInternalServerError struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewPublishPostInternalServerError creates PublishPostInternalServerError with default headers values
func NewPublishPostInternalServerError() *PublishPostInternalServerError {

	return &PublishPostInternalServerError{}
}

// WithPayload adds the payload to the publish post internal server error response
func (o *PublishPostInternalServerError) WithPayload(payload *models.ServiceError) *PublishPostInternalServerError {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the publish post internal server error response
func (o *PublishPostInternalServerError) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *PublishPostInternalServerError) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(500)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}
