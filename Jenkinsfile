def PLAYWRIGHT_VERSION = '1.64.1'

pipeline {
  agent {
    docker {
      image "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
      args '--ipc=host'
    }
  }

  parameters {
    booleanParam(name: 'RUN_LIVE_SMOKE', defaultValue: false,
      description: 'Also run e2e/live against the real Drupal API')
    string(name: 'LIVE_BASE_URL', defaultValue: '',
      description: 'Site for the live smoke tests (e.g. https://billdaff.com). Empty starts the dev server.')
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    HOME = "${env.WORKSPACE}"
    YARN = 'npx --yes yarn@1.22.22'
    PLAYWRIGHT_VERSION = "${PLAYWRIGHT_VERSION}"
  }

  stages {
    stage('Install') {
      steps {
        dir('billdaff') {
          sh '$YARN install --frozen-lockfile'
          sh '''
            npx playwright --version | grep -qx "Version $PLAYWRIGHT_VERSION" || {
              echo "@playwright/test in yarn.lock does not match the Docker image v$PLAYWRIGHT_VERSION"
              exit 1
            }
          '''
        }
      }
    }

    stage('Type check and lint') {
      steps {
        dir('billdaff') {
          sh '$YARN typecheck'
          sh '$YARN lint'
        }
      }
    }

    stage('Unit tests') {
      steps {
        dir('billdaff') {
          sh '$YARN test --watchAll=false'
        }
      }
    }

    stage('E2E (mocked API)') {
      steps {
        dir('billdaff') {
          sh '$YARN test:e2e'
        }
      }
    }

    stage('E2E (live smoke)') {
      when { expression { params.RUN_LIVE_SMOKE } }
      environment {
        E2E_BASE_URL = "${params.LIVE_BASE_URL}"
      }
      steps {
        dir('billdaff') {
          sh '$YARN test:e2e:live'
        }
      }
    }
  }

  post {
    always {
      junit testResults: 'billdaff/reports/junit-*.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'billdaff/playwright-report/**, billdaff/test-results/**',
        allowEmptyArchive: true
    }
  }
}
