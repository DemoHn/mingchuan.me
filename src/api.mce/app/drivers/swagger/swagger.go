package swagger

import (
	"github.com/go-openapi/errors"
	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime"
	"mingchuan.me/app/drivers/swagger/restapi"
	"mingchuan.me/app/drivers/swagger/restapi/operations"

	"net/http"

	"mingchuan.me/infra"
)

// Driver - swagger driver: HTTP server based on swagger
type Driver struct {
	Port         int
	api          *operations.MceAPI
	server       *restapi.Server
	middlewares  []middlewareFunc
	errorHandler ErrorHandlerFunc
}

// API -
type API = operations.MceAPI

// NewDriver -
func NewDriver(infra *infra.Infrastructure) (*Driver, error) {
	var err error
	var port int
	var swaggerSpec *loads.Document
	// parse port
	if port, err = infra.Config.FindInt("global.listen_port"); err != nil {
		return nil, err
	}
	// load swagger
	if swaggerSpec, err = loads.Analyzed(restapi.SwaggerJSON, ""); err != nil {
		return nil, err
	}

	api := operations.NewMceAPI(swaggerSpec)
	srv := restapi.NewServer(api)
	srv.Port = port
	return &Driver{
		Port:         port,
		api:          api,
		server:       srv,
		middlewares:  []middlewareFunc{},
		errorHandler: defaultErrorHandler(),
	}, nil
}

// getters

// GetAPI - getter of s.api
func (d *Driver) GetAPI() *operations.MceAPI {
	return d.api
}

// Listen - listen to server
func (d *Driver) Listen() error {
	d.configureAPI()
	return d.server.Serve()
}

// Close -
func (d *Driver) Close() error {
	return d.server.Shutdown()
}

// internal functions
func (d *Driver) configureAPI() {
	api := d.api

	// configure the api here
	api.ServeError = errors.ServeError

	// Set your custom logger if needed. Default one is log.Printf
	// Expected interface func(string, ...interface{})
	//
	// Example:
	// api.Logger = log.Printf

	api.JSONConsumer = runtime.JSONConsumer()
	api.JSONProducer = runtime.JSONProducer()
	api.ServerShutdown = func() {}

	apiHandler := d.runMiddlewares(api.Serve(d.setupMiddlewares))
	d.server.SetHandler(apiHandler)
}

// no idea how to use it == :sad
func (d *Driver) setupMiddlewares(handler http.Handler) http.Handler {
	return handler
}
