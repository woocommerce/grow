# Run QIT tests

This action provides the following functionality for GitHub Actions users:

- Install QIT-CLI
- Run a set of `qit` tests for a given extension
- Annotate the results


## Usage

See [action.yml](action.yml)

### Prerequisites

- You need to obtain valid [authentication keys](https://woocommerce.github.io/qit-documentation/#/authenticating?id=cli).


### Basic:

```yaml
jobs:
  qit-test:
    name: Run QIT Tests
    runs-on: ubuntu-20.04
    steps:    
      - name: Delegate QIT Tests
        uses: woocommerce/grow/run-qit-extension@actions-v1
        with:
          qit-partner-user: ${{ secrets.QIT_PARTNER_USER }}
          qit-partner-secret: ${{ secrets.QIT_PARTNER_SECRET }}
          extension: 'my-extension'
          test-activation: true
```
