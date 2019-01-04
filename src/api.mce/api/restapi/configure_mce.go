// This file is safe to edit. Once it exists it will not be overwritten

package restapi

import (
	"crypto/tls"
	"net/http"

	errors "github.com/go-openapi/errors"
	runtime "github.com/go-openapi/runtime"
	middleware "github.com/go-openapi/runtime/middleware"

	"mingchuan.me/api/restapi/operations"
	"mingchuan.me/api/restapi/operations/account"
	"mingchuan.me/api/restapi/operations/blog"
	"mingchuan.me/api/restapi/operations/misc"
	"mingchuan.me/api/restapi/operations/todo"
)

//go:generate swagger generate server --target ../../api --name Mce --spec ../swagger.yml --exclude-main

func configureFlags(api *operations.MceAPI) {
	// api.CommandLineOptionsGroups = []swag.CommandLineOptionsGroup{ ... }
}

func configureAPI(api *operations.MceAPI) http.Handler {
	// configure the api here
	api.ServeError = errors.ServeError

	// Set your custom logger if needed. Default one is log.Printf
	// Expected interface func(string, ...interface{})
	//
	// Example:
	// api.Logger = log.Printf

	api.JSONConsumer = runtime.JSONConsumer()

	api.JSONProducer = runtime.JSONProducer()

	api.TodoCreateItemTHandler = todo.CreateItemTHandlerFunc(func(params todo.CreateItemTParams) middleware.Responder {
		return middleware.NotImplemented("operation todo.CreateItemT has not yet been implemented")
	})
	api.BlogCreatePostHandler = blog.CreatePostHandlerFunc(func(params blog.CreatePostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.CreatePost has not yet been implemented")
	})
	api.TodoDeleteItemTHandler = todo.DeleteItemTHandlerFunc(func(params todo.DeleteItemTParams) middleware.Responder {
		return middleware.NotImplemented("operation todo.DeleteItemT has not yet been implemented")
	})
	api.BlogDeletePostHandler = blog.DeletePostHandlerFunc(func(params blog.DeletePostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.DeletePost has not yet been implemented")
	})
	api.BlogGetOnePostHandler = blog.GetOnePostHandlerFunc(func(params blog.GetOnePostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.GetOnePost has not yet been implemented")
	})
	api.BlogGetOnePublicPostHandler = blog.GetOnePublicPostHandlerFunc(func(params blog.GetOnePublicPostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.GetOnePublicPost has not yet been implemented")
	})
	api.MiscHealthCheckHandler = misc.HealthCheckHandlerFunc(func(params misc.HealthCheckParams) middleware.Responder {
		return middleware.NotImplemented("operation misc.HealthCheck has not yet been implemented")
	})
	api.TodoListAllItemsTHandler = todo.ListAllItemsTHandlerFunc(func(params todo.ListAllItemsTParams) middleware.Responder {
		return middleware.NotImplemented("operation todo.ListAllItemsT has not yet been implemented")
	})
	api.BlogListAllPostsHandler = blog.ListAllPostsHandlerFunc(func(params blog.ListAllPostsParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.ListAllPosts has not yet been implemented")
	})
	api.BlogListPublicPostsHandler = blog.ListPublicPostsHandlerFunc(func(params blog.ListPublicPostsParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.ListPublicPosts has not yet been implemented")
	})
	api.AccountLoginHandler = account.LoginHandlerFunc(func(params account.LoginParams) middleware.Responder {
		return middleware.NotImplemented("operation account.Login has not yet been implemented")
	})
	api.BlogPublishPostHandler = blog.PublishPostHandlerFunc(func(params blog.PublishPostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.PublishPost has not yet been implemented")
	})
	api.AccountRegisterAdminHandler = account.RegisterAdminHandlerFunc(func(params account.RegisterAdminParams) middleware.Responder {
		return middleware.NotImplemented("operation account.RegisterAdmin has not yet been implemented")
	})
	api.TodoUpdateItemTHandler = todo.UpdateItemTHandlerFunc(func(params todo.UpdateItemTParams) middleware.Responder {
		return middleware.NotImplemented("operation todo.UpdateItemT has not yet been implemented")
	})
	api.BlogUpdatePostHandler = blog.UpdatePostHandlerFunc(func(params blog.UpdatePostParams) middleware.Responder {
		return middleware.NotImplemented("operation blog.UpdatePost has not yet been implemented")
	})

	api.ServerShutdown = func() {}

	return setupGlobalMiddleware(api.Serve(setupMiddlewares))
}

// The TLS configuration before HTTPS server starts.
func configureTLS(tlsConfig *tls.Config) {
	// Make all necessary changes to the TLS configuration here.
}

// As soon as server is initialized but not run yet, this function will be called.
// If you need to modify a config, store server instance to stop it individually later, this is the place.
// This function can be called multiple times, depending on the number of serving schemes.
// scheme value will be set accordingly: "http", "https" or "unix"
func configureServer(s *http.Server, scheme, addr string) {
}

// The middleware configuration is for the handler executors. These do not apply to the swagger.json document.
// The middleware executes after routing but before authentication, binding and validation
func setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}

// The middleware configuration happens before anything, this middleware also applies to serving the swagger.json document.
// So this is a good place to plug in a panic handling middleware, logging and metrics
func setupGlobalMiddleware(handler http.Handler) http.Handler {
	return handler
}
