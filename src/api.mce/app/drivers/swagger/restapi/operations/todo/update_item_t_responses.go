// Code generated by go-swagger; DO NOT EDIT.

package todo

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"net/http"

	"github.com/go-openapi/runtime"

	models "mingchuan.me/app/drivers/swagger/models"
)

// UpdateItemTOKCode is the HTTP code returned for type UpdateItemTOK
const UpdateItemTOKCode int = 200

/*UpdateItemTOK success

swagger:response updateItemTOK
*/
type UpdateItemTOK struct {

	/*
	  In: Body
	*/
	Payload *models.Todo `json:"body,omitempty"`
}

// NewUpdateItemTOK creates UpdateItemTOK with default headers values
func NewUpdateItemTOK() *UpdateItemTOK {

	return &UpdateItemTOK{}
}

// WithPayload adds the payload to the update item t o k response
func (o *UpdateItemTOK) WithPayload(payload *models.Todo) *UpdateItemTOK {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update item t o k response
func (o *UpdateItemTOK) SetPayload(payload *models.Todo) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdateItemTOK) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(200)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// UpdateItemTBadRequestCode is the HTTP code returned for type UpdateItemTBadRequest
const UpdateItemTBadRequestCode int = 400

/*UpdateItemTBadRequest service error

swagger:response updateItemTBadRequest
*/
type UpdateItemTBadRequest struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewUpdateItemTBadRequest creates UpdateItemTBadRequest with default headers values
func NewUpdateItemTBadRequest() *UpdateItemTBadRequest {

	return &UpdateItemTBadRequest{}
}

// WithPayload adds the payload to the update item t bad request response
func (o *UpdateItemTBadRequest) WithPayload(payload *models.ServiceError) *UpdateItemTBadRequest {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update item t bad request response
func (o *UpdateItemTBadRequest) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdateItemTBadRequest) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(400)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}

// UpdateItemTInternalServerErrorCode is the HTTP code returned for type UpdateItemTInternalServerError
const UpdateItemTInternalServerErrorCode int = 500

/*UpdateItemTInternalServerError service error (fatal)

swagger:response updateItemTInternalServerError
*/
type UpdateItemTInternalServerError struct {

	/*
	  In: Body
	*/
	Payload *models.ServiceError `json:"body,omitempty"`
}

// NewUpdateItemTInternalServerError creates UpdateItemTInternalServerError with default headers values
func NewUpdateItemTInternalServerError() *UpdateItemTInternalServerError {

	return &UpdateItemTInternalServerError{}
}

// WithPayload adds the payload to the update item t internal server error response
func (o *UpdateItemTInternalServerError) WithPayload(payload *models.ServiceError) *UpdateItemTInternalServerError {
	o.Payload = payload
	return o
}

// SetPayload sets the payload to the update item t internal server error response
func (o *UpdateItemTInternalServerError) SetPayload(payload *models.ServiceError) {
	o.Payload = payload
}

// WriteResponse to the client
func (o *UpdateItemTInternalServerError) WriteResponse(rw http.ResponseWriter, producer runtime.Producer) {

	rw.WriteHeader(500)
	if o.Payload != nil {
		payload := o.Payload
		if err := producer.Produce(rw, payload); err != nil {
			panic(err) // let the recovery middleware deal with this
		}
	}
}