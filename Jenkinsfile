pipeline {
    agent any

    environment {
        DOCKER_IMAGE_USER_SERVICE = "pintaram369/user-service"
        DOCKER_IMAGE_PRODUCT_SERVICE = "pintaram369/product-service"
        DOCKER_IMAGE_ORDER_SERVICE = "pintaram369/order-service"
        DOCKER_IMAGE_FRONTEND = "pintaram369/frontend"
        DOCKER_TAG   = "latest"
        REGISTRY_CREDENTIALS = "dockerhub-credentials-id"
        K8S_NAMESPACE = "micro"
        K8S_MANIFESTS_PATH = "k8s-manifests"
        // HELM_RELEASE = "myrelease"
        // HELM_NAMESPACE = "micro"
        // HELM_CHART_PATH = "mychart"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Pintaram-M-ML/Deveops_practice.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building Docker images..."
                    sh """
                        docker build -t ${DOCKER_IMAGE_USER_SERVICE}:${DOCKER_TAG} ./user-service
                        docker build -t ${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG} ./product-service
                        docker build -t ${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG} ./order-service
                        docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ./frontend
                    """
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${REGISTRY_CREDENTIALS}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    """
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    echo "Pushing Docker images to registry..."
                    sh """
                        docker push ${DOCKER_IMAGE_USER_SERVICE}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG}
                        docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Load Images to kind') {
            steps {
                script {
                    echo "Loading Docker images into kind cluster..."
                    sh """
                        kind load docker-image ${DOCKER_IMAGE_USER_SERVICE}:${DOCKER_TAG}
                        kind load docker-image ${DOCKER_IMAGE_PRODUCT_SERVICE}:${DOCKER_TAG}
                        kind load docker-image ${DOCKER_IMAGE_ORDER_SERVICE}:${DOCKER_TAG}
                        kind load docker-image ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying services to Kubernetes using kubectl apply..."
                    sh """
                        # Apply namespace first
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/namespace.yaml

                        # Apply all service deployments
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/user-service-deployment.yaml
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/product-service-deployment.yaml
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/order-service-deployment.yaml
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/frontend-deployment.yaml

                        # Apply ingress
                        kubectl apply -f ${K8S_MANIFESTS_PATH}/ingress.yaml
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    echo "Verifying deployment..."
                    sh """
                        # Wait for deployments to be ready
                        kubectl wait --for=condition=available --timeout=300s deployment/user-service -n ${K8S_NAMESPACE}
                        kubectl wait --for=condition=available --timeout=300s deployment/product-service -n ${K8S_NAMESPACE}
                        kubectl wait --for=condition=available --timeout=300s deployment/order-service -n ${K8S_NAMESPACE}
                        kubectl wait --for=condition=available --timeout=300s deployment/frontend -n ${K8S_NAMESPACE}

                        # Show deployment status
                        echo "=== Pods Status ==="
                        kubectl get pods -n ${K8S_NAMESPACE}

                        echo "=== Services Status ==="
                        kubectl get svc -n ${K8S_NAMESPACE}

                        echo "=== Ingress Status ==="
                        kubectl get ingress -n ${K8S_NAMESPACE}
                    """
                }
            }
        }

        // Commented out Helm deployment - keeping for reference
        // stage('Helm Upgrade / Deploy') {
        //     steps {
        //        sh """
        //             helm upgrade --install myrelease mychart \
        //                 --namespace micro \
        //                 --create-namespace \
        //                 --set services.userService.image.tag=${DOCKER_TAG} \
        //                 --set services.productService.image.tag=${DOCKER_TAG} \
        //                 --set services.orderService.image.tag=${DOCKER_TAG} \
        //                 --set services.frontendService.image.tag=${DOCKER_TAG} \
        //                 --wait \
        //                 --timeout 5m
        //             """
        //     }
        // }
    }

    post {
        success {
            echo "✅ Deployment Successful! All services are running in namespace: ${K8S_NAMESPACE}"
            echo "Access frontend at: http://localhost:30080"
        }
        failure {
            echo "❌ Pipeline Failed! Check logs for details."
            sh """
                echo "=== Failed Pods ==="
                kubectl get pods -n ${K8S_NAMESPACE} | grep -v Running || true

                echo "=== Recent Events ==="
                kubectl get events -n ${K8S_NAMESPACE} --sort-by='.lastTimestamp' | tail -20 || true
            """
        }
        always {
            echo "Cleaning up Docker images..."
            sh "docker system prune -f || true"
        }
    }
}
