# Run QIT test

This action provides the following functionality for GitHub Actions users:

- Run `qit` test of given type for a given extension
- Annotate the results


## Usage

See [action.yml](action.yml)

### Prerequisites

- QIT needs to be [installed](https://woocommerce.github.io/qit-documentation/#/cli/getting-started?id=installing-qit) and [authenticated](https://woocommerce.github.io/qit-documentation/#/authenticating?id=cli)
   - To set up QIT, you need to set `QIT_DISABLE_ONBOARDING` env to `yes`.


### Basic:

```yaml
jobs:
  qit-test:
    name: Run QIT Tests
    runs-on: ubuntu-20.04
    env:
      QIT_DISABLE_ONBOARDING: yes
    steps:
      - name: Install QIT via composer
        run: composer require woocommerce/qit-cli

      - name: Add Partner
        run: |
          ./vendor/bin/qit partner:add \
            --user='${{ secrets.QIT_PARTNER_USER }}' \
            --qit_token='${{ secrets.QIT_PARTNER_SECRET }}'

      - name: Security test
        id: security-test
        uses: woocommerce/grow/run-qit-annotate@actions-v2
        timeout-minutes: 5
        with:
          type: security
          extension: automatewoo
          options: '--optional_features=hpos'

      - name: Echo status
        shell: bash
        run: echo ${{ jobs.security-test.outputs.status }}
```
