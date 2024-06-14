
test:
	npx jest

prettier:
	npx prettier . --write

api:
	docker run -it --rm restream open-api > src/api/api.yaml
	docker run -it --rm \
		-v ${PWD}/src/api:/local \
		openapitools/openapi-generator-cli \
		generate \
		-i /local/api.yaml \
		-g typescript-fetch \
		-o /local \
		--additional-properties=typescriptThreePlus=true