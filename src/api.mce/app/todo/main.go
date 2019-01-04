package todo

import (
	"github.com/jinzhu/gorm"
	"mingchuan.me/api"
)

// TodoService -
type TodoService struct {
	*gorm.DB
	Version uint16
}

// Todo - TODO model
type Todo struct {
	ID      int64  `gorm:"primary_key" json:"id"`
	Content string `gorm:"type:text; not null" json:"content"`
}

// NewService -
func NewService(db *gorm.DB) *TodoService {
	return &TodoService{
		DB:      db,
		Version: 1,
	}
}

// Init - init the service, including auto-migrate table, etc.
func (srv *TodoService) Init() error {
	db := srv.DB

	db = db.AutoMigrate(&Todo{})
	return db.Error
}

// RegisterAPI -
func (srv *TodoService) RegisterAPI(api *api.API) {
	ctrl := CreateController(api, srv)
	ctrl.BindAllRoutes()
}
