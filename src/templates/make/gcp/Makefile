init: check-vars
	rm -rf ./.terraform
	terraform init -backend=true -backend-config=./environments/${ENV}/backend.tfvars -backend-config="bucket=${PROJ}-tf-state"

check-vars: check-var-ENV check-var-PROJ

check-var-%:
	@ if [ "${${*}}" = "" ]; then echo "environment variable '$*' not set"; exit 1; fi

plan: init
	@echo "*******************************************"
	@echo "* ACTION:		PLAN"
	@echo "* ENV:			${ENV}"
	@echo "* PROJ:			${PROJ}"
	@echo "*******************************************"
	terraform plan --var-file=./environments/${ENV}/variables.tfvars -var="project=${PROJ}" -var="env=${ENV}"

apply: init
	@echo "*******************************************"
	@echo "* ACTION:		APPLY"
	@echo "* ENV:			${ENV}"
	@echo "* PROJ:			${PROJ}"
	@echo "*******************************************"
	terraform apply --var-file=./environments/${ENV}/variables.tfvars -var="project=${PROJ}" -var="env=${ENV}"

destroy: init
	@echo "*******************************************"
	@echo "* ACTION:		DESTROY"
	@echo "* ENV:			${ENV}"
	@echo "* PROJ:			${PROJ}"
	@echo "*******************************************"
	terraform destroy --var-file=./environments/${ENV}/variables.tfvars -var="project=${PROJ}" -var="env=${ENV}"
