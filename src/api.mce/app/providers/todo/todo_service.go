package todo

import (
	"github.com/jinzhu/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/errors"
)

// Service - TODO service
type Service struct {
	*gorm.DB
	Version uint16
}

// Todo - TODO model
type Todo struct {
	ID      int64  `gorm:"primary_key" json:"id"`
	Content string `gorm:"type:text; not null" json:"content"`
}

// NewService -
func NewService(db *gorm.DB) *Service {
	return &Service{
		DB:      db,
		Version: 1,
	}
}

// Init - init the service, including auto-migrate table, etc.
func (srv *Service) Init() error {
	db := srv.DB

	db = db.AutoMigrate(&Todo{})
	return db.Error
}

// RegisterAPI -
func (srv *Service) RegisterAPI(api *swagger.API) {
	ctrl := NewController(api, srv)
	ctrl.BindAllRoutes()
}

// Other Methods

// CreateTodo -
func (srv *Service) CreateTodo(content string) (*Todo, *errors.Error) {
	db := srv.DB

	newTodo := &Todo{
		Content: content,
	}
	db = db.Create(newTodo)

	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	return newTodo, nil
}

// UpdateTodo -
func (srv *Service) UpdateTodo(id int64, content string) (*Todo, *errors.Error) {
	db := srv.DB
	var todo Todo

	db = db.Where("id = ?", id).First(&todo)
	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	db = db.Model(&todo).Update("content", content)
	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	return &todo, nil
}

// DeleteTodo -
func (srv *Service) DeleteTodo(id int64) (*Todo, *errors.Error) {
	db := srv.DB
	var todo Todo

	// find the corresponded ID
	db = db.Find(&todo, "id = ?", id)

	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}
	// delete it
	db = db.Delete(&todo)
	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	return &todo, nil
}

// ListAllTodos -
func (srv *Service) ListAllTodos() (*[]Todo, *errors.Error) {
	db := srv.DB
	todos := make([]Todo, 0)

	db = db.Find(&todos)
	if db.Error != nil {
		return nil, errors.SQLExecutionError(db.Error)
	}

	return &todos, nil
}
