package test

import (
	"fmt"
	"testing"

	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
	test_structure "github.com/gruntwork-io/terratest/modules/test-structure"
	"github.com/stretchr/testify/assert"
)

// An example of how to test the Terraform module in examples/vpc using Terratest.
func TestVpc(t *testing.T) {
	t.Parallel()

	// Make a copy of the terraform module to a temporary directory. This allows running multiple tests in parallel
	// against the same terraform module
	exampleFolder := test_structure.CopyTerraformFolderToTemp(t, "../", "examples/vpc")

	// Set the required variable values
	environmentName := "UNITTEST"
	label := fmt.Sprintf("%s-vpc-%s", environmentName, random.UniqueId())

	// Configure the options with default retryable errors to handle the most common retryable errors encountered in
	// terraform testing.
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		// The path to where our Terraform code is located
		TerraformDir: exampleFolder,

		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"env":   environmentName,
			"label": label,
		},
	})

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// Run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApply(t, terraformOptions)

	// Run `terraform output` to get the value of an output variable
	instanceLabel := terraform.Output(t, terraformOptions, "label")

	// Verify that the label given to the vpc is the expected label
	assert.Equal(t, label, instanceLabel)
}
