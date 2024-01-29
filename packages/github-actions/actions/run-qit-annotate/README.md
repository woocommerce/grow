# Run QIT test

This action provides the following functionality for GitHub Actions users:

- Run `qit` test of given type for a given extension
- Annotate the results
- Forward status code, so the consumer can decide how to conclude the results


## Usage

See [action.yml](action.yml)

### Prerequisites

- QIT needs to be [installed](https://woocommerce.github.io/qit-documentation/#/cli/getting-started?id=installing-qit) and [authenticated](https://woocommerce.github.io/qit-documentation/#/authenticating?id=cli)
   - To setup QIT, you need to set `QIT_DISABLE_ONBOARDING` env to `yes`.
- The action assumes there is `qit-results` directory. You can change it's name using `results-folder` input.


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
            --application_password='${{ secrets.QIT_PARTNER_SECRET }}'

      - name: Create results dir
        run: mkdir -p ./qit-results/automatewoo

      - name: Security test
        id: security-test
        uses: woocommerce/grow/run-qit-annotate@actions-v1
        timeout-minutes: 5
        with:
          type: security
          extension: automatewoo
          options: '--optional_features=hpos'

      - name: Echo status
        shell: bash
        run: echo ${{ jobs.security-test.outputs.status }}
```