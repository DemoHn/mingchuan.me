package swagger

import (
	"net/http"

	"mingchuan.me/app/errors"
)

// HandlerFunc defines a middleware func with error
type HandlerFunc = func(w http.ResponseWriter, r *http.Request) *errors.Error

// ErrorHandlerFunc defines the return handlerFunc for error Handler
type ErrorHandlerFunc = func(w http.ResponseWriter, r *http.Request, err *errors.Error)
type middlewareFunc = func(HandlerFunc) HandlerFunc

// Use - use middleware (actually just register middleware to middlewares' list)
func (d *Driver) Use(mid middlewareFunc) {
	// prepend middlewares
	d.middlewares = append([]middlewareFunc{mid}, d.middlewares...)
}

// SetErrorHandler -
func (d *Driver) SetErrorHandler(eHandler ErrorHandlerFunc) {
	d.errorHandler = eHandler
}

// internal functions
// ExecuteMiddlewares -
func (d *Driver) runMiddlewares(handler http.Handler) http.Handler {
	var nextHandler HandlerFunc
	nextHandler = func(w http.ResponseWriter, r *http.Request) *errors.Error {
		handler.ServeHTTP(w, r)
		return nil
	}

	for _, mf := range d.middlewares {
		nextHandler = d.handleError(mf(nextHandler))
	}

	//return d.errorHandler(nextHandler)
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			nextHandler(w, r)
		})
}

func (d *Driver) handleError(h HandlerFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) *errors.Error {
		err := h(w, r)
		if err != nil {
			d.errorHandler(w, r, err)
		}
		return nil
	}
}
func defaultErrorHandler() ErrorHandlerFunc {
	return func(w http.ResponseWriter, r *http.Request, err *errors.Error) {
		// do nothing
	}
}
