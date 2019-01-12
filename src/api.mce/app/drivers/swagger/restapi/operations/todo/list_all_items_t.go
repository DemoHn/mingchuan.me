// Code generated by go-swagger; DO NOT EDIT.

package todo

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	middleware "github.com/go-openapi/runtime/middleware"
)

// ListAllItemsTHandlerFunc turns a function with the right signature into a list all items t handler
type ListAllItemsTHandlerFunc func(ListAllItemsTParams) middleware.Responder

// Handle executing the request and returning a response
func (fn ListAllItemsTHandlerFunc) Handle(params ListAllItemsTParams) middleware.Responder {
	return fn(params)
}

// ListAllItemsTHandler interface for that can handle valid list all items t params
type ListAllItemsTHandler interface {
	Handle(ListAllItemsTParams) middleware.Responder
}

// NewListAllItemsT creates a new http.Handler for the list all items t operation
func NewListAllItemsT(ctx *middleware.Context, handler ListAllItemsTHandler) *ListAllItemsT {
	return &ListAllItemsT{Context: ctx, Handler: handler}
}

/*ListAllItemsT swagger:route GET /admin/todos todo listAllItemsT

list all TODO items

*/
type ListAllItemsT struct {
	Context *middleware.Context
	Handler ListAllItemsTHandler
}

func (o *ListAllItemsT) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		r = rCtx
	}
	var Params = NewListAllItemsTParams()

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}