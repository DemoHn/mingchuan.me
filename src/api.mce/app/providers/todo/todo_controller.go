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
func NewController(api *swagger.API, service *Service) *Controller {
	return &Controller{
		API:     api,
		Service: service,
	}
}

// BindAllRoutes -
func (ctrl *Controller) BindAllRoutes() {
	API := ctrl.API
	service := ctrl.Service

	// CreateItem
	API.TodoCreateItemTHandler = apiTodo.CreateItemTHandlerFunc(
		func(params apiTodo.CreateItemTParams) middleware.Responder {
			request := params.Request
			content := request.Content

			// service
			todo, err := service.CreateTodo(content)
			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewCreateItemTBadRequest().WithPayload(wErr)
			}

			resp := getTodoResponse(todo)
			return apiTodo.NewCreateItemTOK().WithPayload(resp)
		})

	// ListAllItems
	API.TodoListAllItemsTHandler = apiTodo.ListAllItemsTHandlerFunc(
		func(params apiTodo.ListAllItemsTParams) middleware.Responder {
			// service
			todos, err := service.ListAllTodos()

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
	API.TodoDeleteItemTHandler = apiTodo.DeleteItemTHandlerFunc(
		func(params apiTodo.DeleteItemTParams) middleware.Responder {
			id := params.ID

			// services
			todo, err := service.DeleteTodo(id)
			if err != nil {
				wErr := swagger.ModelServiceError(err)
				return apiTodo.NewDeleteItemTBadRequest().WithPayload(wErr)
			}

			resp := getTodoResponse(todo)
			return apiTodo.NewDeleteItemTOK().WithPayload(resp)
		})

	// UpdateTodo
	API.TodoUpdateItemTHandler = apiTodo.UpdateItemTHandlerFunc(
		func(params apiTodo.UpdateItemTParams) middleware.Responder {
			id := params.ID
			request := params.Request
			newContent := request.Content

			// services
			todo, err := service.UpdateTodo(id, newContent)
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
