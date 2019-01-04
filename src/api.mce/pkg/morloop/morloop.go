package morloop

import (
	"net/http"
)

// Morloop - Morloop main type
type Morloop struct {
	*Logger
	*Error
	*Router
	*Server
}

// New - new morloop instance
func New(port int) *Morloop {
	router := NewRouter()
	// serverConfig
	sConfig := ServerConfig{
		HttpPort: port,
	}

	return &Morloop{
		Logger: &Logger{},
		Router: router,
		Server: NewServer(&sConfig),
		Error:  &Error{},
	}
}

// Listen - listen to server (http or https)
func (app *Morloop) Listen() {
	app.Server.BindRoutes(app.Router)
	app.Server.Listen()
}

// Use - register middlewares
func (app *Morloop) Use(mw ...MiddlewareFunc) {
	app.Router.RegisterMiddleware(mw...)
}

// Static - Serve static file
func (app *Morloop) Static(route string, dir string) {
	muxRouter := app.Router.Mux
	fs := http.StripPrefix(route, http.FileServer(http.Dir(dir)))
	muxRouter.PathPrefix(route).Handler(fs)
}

// Route - Bind route (also `morloop.Router.{Bind,Get,Post}` is fine)
func (app *Morloop) Route(method string, route string, handler RequestHandler) {
	app.Router.Bind(method, route, handler)
}
