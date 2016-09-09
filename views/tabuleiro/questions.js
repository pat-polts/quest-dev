/**
 * Created by manoel_motoso on 01/09/16.
 */
'use strict';

angular.module('questAstrazeneca.tabuleiro', [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/question/:questionId', {
            templateUrl: 'tabuleiro/question.html',
            controller: 'QuestionCtrl'
        });
    }])
    .controller('QuestionCtrl', function ($scope, Question, $timeout, $cookieStore, $routeParams,config,UserAPI) {
                /**
                 * redireciona para a tela de login caso o usuario seja invalido
                 */
                if (!$cookieStore.get('user')) {
                    location.href = '#!/user';
                }else{
                    $scope.user = $cookieStore.get('user');
                }

                $scope.question =  $cookieStore.get('question['+ $routeParams.questionId+']');

                $scope.setAlternative = function (alternative) {
                    $scope.showButtonPronto = true;
                    $scope.optionSelected = alternative;
                };
                /**
                 * A cada alternativa selecionada e incrementado ao score do usuario o valor
                 * correspondente dessa, caso seja a correta.
                 * @param alternative
                 */
                $scope.incrementScore = function (alternative) {
                    var alternatives =  $scope.question.alternatives;
                alternative.class = 'orange';
                /**
                 * seta um intervalo de 3 segundos após a alternativa ser selecionada.
                 */
                $timeout(function () {
                    location.href = "#!/tabuleiro"
                }, 3000);

                /**
                 * Pinta a alternaticva correta com a cor verde
                 * e a selecionada com a cor laranja.
                 */
                $scope.question.alternatives = alternatives.filter(function (alternative) {
                    document.getElementById(alternative._id + 'X').disabled = true;
                    document.getElementById(alternative._id).disabled = true;
                    $scope.showButtonPronto = false;
                    if (alternative.right == true) {
                        alternative.class = "green"
                    }
                    return true;
                });

                var data = {
                    "userId": $scope.user._id,
                    "alternative": alternative,
                    "question": $scope.question
                };
                /**
                 * Incrementa o valor da alternativa ao score do usuario e salva o historico das
                 * questoes respondidas no servidor .
                 * @return user //atualizado
                 */
                UserAPI.putUser(data)
                    .then(function success(response) {
                            console.log(response.data);
                            $cookieStore.put('user',response.data);
                            $cookieStore.put('progresso',$scope.question._id);
                            $scope.user = $cookieStore.get('user');

                        },
                        function errorCallback(error) {
                            console.log(error)
                        });

            };
        }
    );