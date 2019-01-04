package morloop

import "net/http"

type templateHandler struct {
	MorloopHandler RequestHandler
}

func (h *templateHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	wrapReq := Request{
		HttpRequest: req,
	}
	wrapRes := Response{
		ResponseWriter: w,
	}
	handler := h.MorloopHandler
	handler(&wrapReq, &wrapRes)
}

// createHandler - a factory return a HTTP Handler [ `func (w http.ResponseWriter, req *http.Request)` ]
func createHandler(handler RequestHandler) http.Handler {
	return &templateHandler{
		MorloopHandler: handler,
	}
}
