package morloop

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/imdario/mergo"
)

// ServerConfig - server config
type ServerConfig struct {
	HttpPort    int
	HttpsPort   int
	Timeout     time.Duration // in second
	EnableHttps bool
	// TODO
	// TLS Config (For HTTPS only)
}

// Server -
type Server struct {
	Config ServerConfig
	// HttpServer - http.server instance
	HttpServer *http.Server
	// HttpsServer - https.server instance
	HttpsServer *http.Server
}

// NewServer - new server instance
func NewServer(config *ServerConfig) *Server {
	defaultConfig := ServerConfig{
		HttpPort:    80,
		HttpsPort:   443,
		Timeout:     time.Duration(10),
		EnableHttps: false,
	}

	// merge config to default
	if err := mergo.Merge(&defaultConfig, config, mergo.WithOverride); err != nil {
		panic(err)
	}

	serv := Server{
		Config: defaultConfig,
	}

	// init http server
	serv.HttpServer = &http.Server{
		Addr: fmt.Sprintf(":%d", serv.Config.HttpPort),
		// TODO
		ReadTimeout:    serv.Config.Timeout * time.Second,
		WriteTimeout:   serv.Config.Timeout * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	// init https servr if enabled
	if serv.Config.EnableHttps == true {
		serv.HttpsServer = &http.Server{
			Addr: fmt.Sprintf(":%d", serv.Config.HttpsPort),
			// TODO: add TLS config
			ReadTimeout:    serv.Config.Timeout * time.Second,
			WriteTimeout:   serv.Config.Timeout * time.Second,
			MaxHeaderBytes: 1 << 20,
		}
	}

	return &serv
}

// BindRoute - bind all routes to server
func (server *Server) BindRoutes(router *Router) {
	server.HttpServer.Handler = router.GetMux()

	if server.Config.EnableHttps == true {
		server.HttpsServer.Handler = router.GetMux()
	}
}

// Listen - listen to server
func (server *Server) Listen() {
	// TODO: more detailed log
	go func() {
		log.Printf("listen to http port[%d]\n", server.Config.HttpPort)
		errL := server.HttpServer.ListenAndServe()
		log.Print(errL)
	}()

	if server.Config.EnableHttps {
		go func() {
			log.Printf("listen to https port[%d]\n", server.Config.HttpsPort)
			errS := server.HttpsServer.ListenAndServe()
			log.Print(errS)
		}()
	}
}
