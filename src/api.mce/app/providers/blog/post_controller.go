package blog

import (
	"github.com/go-openapi/runtime/middleware"
	"mingchuan.me/api"
	"mingchuan.me/api/models"
	apiBlog "mingchuan.me/api/restapi/operations/blog"
)

// PostController -
type PostController struct {
	*api.API
	Service *BlogService
}

// CreatePostController -
func CreatePostController(api *api.API, service *BlogService) *PostController {
	return &PostController{
		API:     api,
		Service: service,
	}
}

// GetOnePost - get one post by post ID
// It's the most easy way to get the info of one post. (including drafted, private, etc...)
func (ctrl *PostController) GetOnePost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogGetOnePostHandler = apiBlog.GetOnePostHandlerFunc(
		func(params apiBlog.GetOnePostParams) middleware.Responder {
			id := uint32(params.ID)

			// service
			article, err := service.GetOnePost(id)
			if err != nil {
				mErr := api.ModelServiceError(err)
				return apiBlog.NewGetOnePostBadRequest().WithPayload(mErr)
			}
			resp := article2Post(article)

			return apiBlog.NewGetOnePostOK().WithPayload(resp)
		})
}

// CreatePost -
func (ctrl *PostController) CreatePost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogCreatePostHandler = apiBlog.CreatePostHandlerFunc(
		func(params apiBlog.CreatePostParams) middleware.Responder {
			request := params.Request

			title := request.Title
			content := request.Content
			status := request.Status
			permission := request.Permission
			// service
			article, err := service.CreatePost(title, content, status, permission)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewCreatePostBadRequest().WithPayload(wErr)
			}

			resp := article2Post(article)
			return apiBlog.NewCreatePostOK().WithPayload(resp)
		})
}

// PublishPost -
func (ctrl *PostController) PublishPost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogPublishPostHandler = apiBlog.PublishPostHandlerFunc(
		func(params apiBlog.PublishPostParams) middleware.Responder {
			id := uint32(params.ID)
			// service
			article, err := service.PublishPost(id)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewPublishPostBadRequest().WithPayload(wErr)
			}

			resp := article2Post(*article)
			return apiBlog.NewPublishPostOK().WithPayload(resp)
		})
}

// UpdatePost -
func (ctrl *PostController) UpdatePost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogUpdatePostHandler = apiBlog.UpdatePostHandlerFunc(
		func(params apiBlog.UpdatePostParams) middleware.Responder {
			id := uint32(params.ID)
			request := params.Request
			// construct payload
			payload := &ArticleUpdatePayload{
				Title:      request.Title,
				Content:    request.Content,
				Status:     request.Status,
				Permission: request.Permission,
			}

			// service
			article, err := service.UpdatePost(id, payload)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewUpdatePostBadRequest().WithPayload(wErr)
			}

			resp := article2Post(*article)
			return apiBlog.NewUpdatePostOK().WithPayload(resp)
		})
}

// DeletePost -
func (ctrl *PostController) DeletePost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogDeletePostHandler = apiBlog.DeletePostHandlerFunc(
		func(params apiBlog.DeletePostParams) middleware.Responder {
			id := uint32(params.ID)
			// service
			err := service.DeletePost(id)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewDeletePostBadRequest().WithPayload(wErr)
			}

			resp := &models.DeletePostResponse{
				ID:      params.ID,
				Success: true,
			}

			return apiBlog.NewDeletePostOK().WithPayload(resp)
		})
}

// PUBLIC API

// GetOnePublicPost -
func (ctrl *PostController) GetOnePublicPost() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogGetOnePublicPostHandler = apiBlog.GetOnePublicPostHandlerFunc(
		func(params apiBlog.GetOnePublicPostParams) middleware.Responder {
			id := uint32(params.ID)

			// service
			article, err := service.GetOnePublicPost(id)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewGetOnePublicPostBadRequest().WithPayload(wErr)
			}

			resp := article2Post(*article)
			return apiBlog.NewGetOnePublicPostOK().WithPayload(resp)
		})
}

// ListAllPosts -
func (ctrl *PostController) ListAllPosts() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogListAllPostsHandler = apiBlog.ListAllPostsHandlerFunc(
		func(params apiBlog.ListAllPostsParams) middleware.Responder {
			page := params.Page
			limit := params.Limit

			rPage, articles, err := service.ListAllPostsByPage(page, limit)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewListAllPostsBadRequest().WithPayload(wErr)
			}

			modelArticles := make([]*models.Post, 0)
			for _, article := range articles {
				modelArticles = append(modelArticles, article2Post(article))
			}
			resp := &models.PostsListOfPage{
				Posts: modelArticles,
				Page:  rPage,
			}

			return apiBlog.NewListAllPostsOK().WithPayload(resp)
		})
}

// ListAllPublicPosts -
func (ctrl *PostController) ListAllPublicPosts() {
	API := ctrl.API
	service := ctrl.Service

	API.BlogListPublicPostsHandler = apiBlog.ListPublicPostsHandlerFunc(
		func(params apiBlog.ListPublicPostsParams) middleware.Responder {
			cursor := params.Cursor
			limit := params.Limit

			hasMore, fCursor, articles, err := service.ListPublicPostsByCursor(cursor, limit)
			if err != nil {
				wErr := api.ModelServiceError(err)
				return apiBlog.NewListPublicPostsBadRequest().WithPayload(wErr)
			}

			modelArticles := make([]*models.Post, 0)
			for _, article := range articles {
				modelArticles = append(modelArticles, article2Post(article))
			}

			resp := &models.PostsList{
				HasMore: hasMore,
				Cursor:  fCursor,
				Posts:   modelArticles,
			}
			return apiBlog.NewListPublicPostsOK().WithPayload(resp)
		})
}

// internal helpers
func article2Post(article Article) *models.Post {
	return &models.Post{
		Content:    article.Content,
		ID:         int64(article.ID),
		Permission: article.Permission,
		Status:     article.Status,
		Title:      article.Title,
		CreatedAt:  article.CreatedAt.Unix(),
		UpdatedAt:  article.UpdatedAt.Unix(),
	}
}
