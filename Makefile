include .env
export $(shell sed 's/=.*//' .env)

clean:
	@docker image rm --force $(HUB_URL)/$(APP_NAME):$(APP_VERSION) || true

build:
	@docker build -t ${HUB_URL}/$(APP_NAME):$(APP_VERSION) .

publish:
	@docker login ${HUB_URL}
	@docker push ${HUB_URL}/$(APP_NAME):$(APP_VERSION)

lint:
	@docker run --rm -i hadolint/hadolint < Dockerfile
