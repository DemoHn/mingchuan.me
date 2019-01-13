package app

import (
	"log"
	"os"

	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/middlewares"
	"mingchuan.me/app/providers/account"
	"mingchuan.me/app/providers/blog"
	"mingchuan.me/app/providers/healthz"
	"mingchuan.me/app/providers/todo"
	"mingchuan.me/infra"
	"mingchuan.me/util"

	"github.com/jinzhu/gorm"
	"github.com/urfave/cli"
	// FixMe
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

// App - Instance
type App struct {
	Version   int
	CLI       *cli.Context
	apiServer *swagger.Driver
}

// New - new App instance
func New(c *cli.Context) *App {
	return &App{
		Version: 1,
		CLI:     c,
	}
}

// setters

// Init - init services
func (app *App) Init() error {
	var err error

	debugMode := (os.Getenv("DEBUG") == "1")
	configPath := app.CLI.String("config")
	// 01. init infra
	infra := infra.New(configPath, debugMode)

	// 02. init DB
	var db *gorm.DB
	var dbURL string
	if dbURL, err = util.GenerateDatabaseURL(infra.Config); err != nil {
		return err
	}

	if db, err = gorm.Open("mysql", dbURL); err != nil {
		return err
	}

	// 02. init apiServer - swagger
	var apiServer *swagger.Driver
	if apiServer, err = swagger.NewDriver(infra); err != nil {
		return err
	}
	app.apiServer = apiServer

	// 03. register middlewares
	apiServer.Use(middlewares.Auth)
	apiServer.SetErrorHandler(middlewares.HandleError)

	API := apiServer.GetAPI()

	// 04. init account module
	var jwtSecret string
	if jwtSecret, err = infra.Config.FindString("global.admin_jwt_secret"); err != nil {
		return err
	}

	// 04. init account module
	accountService := account.NewService(db, jwtSecret)
	if err = accountService.Init(); err != nil {
		return err
	}
	accountService.RegisterAPI(API)

	// 05. blog module
	blogService := blog.NewService(db)
	if err = blogService.Init(); err != nil {
		return err
	}
	blogService.RegisterAPI(API)

	// 06. TODO module
	todoService := todo.NewService(db)
	if err = todoService.Init(); err != nil {
		return err
	}
	todoService.RegisterAPI(API)

	// 06. health check
	healthz.RegisterAPI(API)

	return nil
}

// Start - start the whole instance
// Normally the program will hang util receiving stop signal
// @returns - stop signal ID
func Start(context *cli.Context) error {
	app := New(context)
	if err := app.Init(); err != nil {
		return err
	}

	app.apiServer.Listen()
	log.Println("mingchuan.me API is on!")

	return nil
}
