package todo

import (
	"github.com/go-openapi/runtime/middleware"
	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/drivers/swagger/models"
	apiTodo "mingchuan.me/app/drivers/swagger/restapi/operations/todo"
)

// Controller -
type Controller struct {
	*swagger.API
	*Service
}

// NewController -
func NewController(api *swagger.Driver, service *Service) *Controller {
	cc := &Controller{
		API:     api.GetAPI(),
		Service: service,
	}

	cc.bindAllRoutes()
	return cc
}

func (c *Controller) bindAllRoutes() {		

	// CreateItem
	c.TodoCreateItemTHandler = apiTodo.CreateItemTHandlerFunc(
		func(params apiTodo.CreateItemTParams) middleware.Responder {
			request := params.Request
			content := request.Content

			// service
			todo, err := c.CreateTodo(content)
			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewCreateItemTBadRequest().WithPayload(wErr)
			}

			resp := getTodoResponse(todo)
			return apiTodo.NewCreateItemTOK().WithPayload(resp)
		})

	// ListAllItems
	c.TodoListAllItemsTHandler = apiTodo.ListAllItemsTHandlerFunc(
		func(params apiTodo.ListAllItemsTParams) middleware.Responder {
			// service
			todos, err := c.ListAllTodos()

			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewListAllItemsTBadRequest().WithPayload(wErr)
			}

			// bind response
			mTodos := make([]*models.Todo, 0)
			for _, todo := range *todos {
				mTodos = append(mTodos, getTodoResponse(&todo))
			}

			mTodoList := &models.TodoList{
				Todos: mTodos,
			}
			return apiTodo.NewListAllItemsTOK().WithPayload(mTodoList)
		})

	// DeleteItems
	c.TodoDeleteItemTHandler = apiTodo.DeleteItemTHandlerFunc(
		func(params apiTodo.DeleteItemTParams) middleware.Responder {
			id := params.ID

			// services
			todo, err := c.DeleteTodo(id)
			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewDeleteItemTBadRequest().WithPayload(wErr)
			}

			resp := getTodoResponse(todo)
			return apiTodo.NewDeleteItemTOK().WithPayload(resp)
		})

	// UpdateTodo
	c.TodoUpdateItemTHandler = apiTodo.UpdateItemTHandlerFunc(
		func(params apiTodo.UpdateItemTParams) middleware.Responder {
			id := params.ID
			request := params.Request
			newContent := request.Content

			// services
			todo, err := c.UpdateTodo(id, newContent)
			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewUpdateItemTBadRequest().WithPayload(wErr)
			}

			resp := getTodoResponse(todo)
			return apiTodo.NewUpdateItemTOK().WithPayload(resp)
		})
}

func getTodoResponse(v *Todo) *models.Todo {
	return &models.Todo{
		ID:      v.ID,
		Content: v.Content,
	}
}
