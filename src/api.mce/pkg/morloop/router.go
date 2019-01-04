package morloop

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ttacon/chalk"
)

// Router - morloop router
type Router struct {
	Mux         *mux.Router
	Middlewares []MiddlewareFunc
}

const (
	GET     = "GET"
	POST    = "POST"
	DELETE  = "DELETE"
	PUT     = "PUT"
	PATCH   = "PATCH"
	OPTIONS = "OPTIONS"
)

// MiddlewareFunc -
type MiddlewareFunc func(next RequestHandler) RequestHandler

// RequestHandler - func type of controller
type RequestHandler func(req *Request, res *Response)

// NewRouter initialize the mux's router
func NewRouter() *Router {
	r := mux.NewRouter()
	overrideOnRouteNotFound(r)
	return &Router{
		Mux: r,
	}
}

// GetMux - original Mux Router
func (r *Router) GetMux() *mux.Router {
	return r.Mux
}

// SubRouter - generate new subrouter with specific prefix
func (r *Router) SubRouter(prefix string) *Router {
	s := r.GetMux().PathPrefix(prefix).Subrouter()

	return &Router{
		Mux:         s,
		Middlewares: r.Middlewares,
	}
}

// RegisterMiddleware - register middlewares
func (r *Router) RegisterMiddleware(mwf ...MiddlewareFunc) {
	for _, mw := range mwf {
		r.Middlewares = append(r.Middlewares, mw)
	}
}

// Bind - bind routes with handler
func (r *Router) Bind(method string, route string, handler RequestHandler) {
	wrapHandler := func(w http.ResponseWriter, req *http.Request) {
		wrapReq := Request{
			HttpRequest: req,
		}
		wrapRes := Response{
			ResponseWriter: w,
		}

		mHandler := func(wReq *Request, wRes *Response) {
			// really handle things
			handler(wReq, wRes)
			// write audit log
			auditLog(wReq, wRes)
		}

		// TODO: execute middlewares
		for i := len(r.Middlewares) - 1; i >= 0; i-- {
			mw := r.Middlewares[i]
			mHandler = mw(mHandler)
		}

		mHandler(&wrapReq, &wrapRes)
	}

	rt := r.Mux.HandleFunc(route, wrapHandler)
	// sometimes if you hope multiple
	if method != "" {
		rt.Methods(method)
	}
}

/** Bind() Helper */
// Get - Bind GET routes
func (r *Router) Get(route string, handler RequestHandler) {
	r.Bind(GET, route, handler)
}

// GET - alias of Get()
func (r *Router) GET(route string, handler RequestHandler) {
	r.Get(route, handler)
}

// Post - Bind POST routes
func (r *Router) Post(route string, handler RequestHandler) {
	r.Bind(POST, route, handler)
}

// POST - alias of Post()
func (r *Router) POST(route string, handler RequestHandler) {
	r.Post(route, handler)
}

// Delete - Bind DELETE rotues
func (r *Router) Delete(route string, handler RequestHandler) {
	r.Bind(DELETE, route, handler)
}

// DELETE - alias of Delete()
func (r *Router) DELETE(route string, handler RequestHandler) {
	r.Delete(route, handler)
}

// Put - Bind PUT routes
func (r *Router) Put(route string, handler RequestHandler) {
	r.Bind(PUT, route, handler)
}

// PUT - alias of PUT()
func (r *Router) PUT(route string, handler RequestHandler) {
	r.Put(route, handler)
}

// Patch - Bind PATCH routes
func (r *Router) Patch(route string, handler RequestHandler) {
	r.Bind(PATCH, route, handler)
}

// PATCH - alias of Patch()
func (r *Router) PATCH(route string, handler RequestHandler) {
	r.Patch(route, handler)
}

// Patch - Bind OPTIONS routes
func (r *Router) Options(route string, handler RequestHandler) {
	r.Bind(OPTIONS, route, handler)
}

// PATCH - alias of Patch()
func (r *Router) OPTIONS(route string, handler RequestHandler) {
	r.Options(route, handler)
}

// internal function
func auditLog(req *Request, res *Response) {
	fmtStr := fmt.Sprintf("%s %s - %s %s",
		// Don't ask me why the format is so strange,
		// ask Go doc instead!
		chalk.Cyan.Color(req.GetMethod()),
		req.GetPath(),
		res.GetResponseCode(),
		fmt.Sprintf(chalk.Yellow.Color("length=%d"), res.GetBodyLength()),
	)
	log.Println(fmtStr)

	// show error
	if res.GetResponseCode() != "200" {
		log.Println(string(res.GetBody()))
	}
}

// onRouteNotFound - impl a custom version of 404 Error
// with 404 log
func overrideOnRouteNotFound(r *mux.Router) {
	r.NotFoundHandler = createHandler(func(req *Request, res *Response) {
		notFoundError := ResourceNotFoundError(req.GetMethod(), req.GetPath())
		res.writeError(notFoundError)
		auditLog(req, res)
	})
}
