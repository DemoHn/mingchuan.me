package api

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
func (s *Server) Use(mid middlewareFunc) {
	// prepend middlewares
	s.middlewares = append([]middlewareFunc{mid}, s.middlewares...)
}

func (s *Server) SetErrorHandler(eHandler ErrorHandlerFunc) {
	s.errorHandler = eHandler
}

// internal functions

// ExecuteMiddlewares -
func (s *Server) runMiddlewares(handler http.Handler) http.Handler {
	var nextHandler HandlerFunc
	nextHandler = func(w http.ResponseWriter, r *http.Request) *errors.Error {
		handler.ServeHTTP(w, r)
		return nil
	}

	for _, mf := range s.middlewares {
		nextHandler = s.handleError(mf(nextHandler))
	}

	//return s.errorHandler(nextHandler)
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			nextHandler(w, r)
		})
}

func (s *Server) handleError(h HandlerFunc) HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) *errors.Error {
		err := h(w, r)
		if err != nil {
			s.errorHandler(w, r, err)
		}
		return nil
	}
}
func defaultErrorHandler() ErrorHandlerFunc {
	return func(w http.ResponseWriter, r *http.Request, err *errors.Error) {
		// do nothing
	}
}
