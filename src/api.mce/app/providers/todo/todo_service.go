package todo

import (
	"mingchuan.me/app/drivers/gorm"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/errors"
	"mingchuan.me/infra"
)

// Service - TODO service
type Service struct {
	DB *gorm.Driver
	// infra
	*infra.Infrastructure
}

// Todo - TODO model
type Todo struct {
	ID      int64  `gorm:"primary_key" json:"id"`
	Content string `gorm:"type:text; not null" json:"content"`
}

// NewService -
func NewService(infra *infra.Infrastructure, db *gorm.Driver) (*Service, error) {
	var err error
	if err = db.AutoMigrate(&Todo{}).Error(); err != nil {
		return nil, err
	}

	return &Service{DB: db}, nil
}

// RegisterAPI -
func (srv *Service) RegisterAPI(api *swagger.API) {
	//ctrl := NewController(api, srv)
	//ctrl.BindAllRoutes()
}

// Other Methods

// CreateTodo -
func (srv *Service) CreateTodo(content string) (*Todo, *errors.Error) {
	db := srv.DB

	newTodo := &Todo{
		Content: content,
	}
	db = db.Create(newTodo)

	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	return newTodo, nil
}

// UpdateTodo -
func (srv *Service) UpdateTodo(id int64, content string) (*Todo, *errors.Error) {
	db := srv.DB
	var todo Todo

	db = db.Where("id = ?", id).First(&todo)
	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	db = db.Model(&todo).Update("content", content)
	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	return &todo, nil
}

// DeleteTodo -
func (srv *Service) DeleteTodo(id int64) (*Todo, *errors.Error) {
	db := srv.DB
	var todo Todo

	// find the corresponded ID
	db = db.Find(&todo, "id = ?", id)

	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}
	// delete it
	db = db.Delete(&todo)
	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	return &todo, nil
}

// ListAllTodos -
func (srv *Service) ListAllTodos() (*[]Todo, *errors.Error) {
	db := srv.DB
	todos := make([]Todo, 0)

	db = db.Find(&todos)
	if db.Error() != nil {
		return nil, errors.SQLExecutionError(db.Error())
	}

	return &todos, nil
}
