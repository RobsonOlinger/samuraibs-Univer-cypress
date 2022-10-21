import signup from '../support/pages/signup'
import signupPage from '../support/pages/signup'


describe('cadstro', function () {


    context('quando usário é novato', function () {

        const user = {
            name: 'Fernando Papito',
            email: 'papito@samuraibs.com',
            password: 'pwd123'

        }

        before(function () {

            cy.task('removeUser', user.email).then(function (result) {
                console.log(result)
            })
        })


        it('deve cadastrar um novo usuário', () => {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldtHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        });


    })


    context('não deve cadastrar', function () {
        const user = {
            name: 'João Lucas',
            email: 'joao@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {

            cy.task('removeUser', user.email).then(function (result) {
                console.log(result)
            })

            cy.request(

                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {

                expect(response.status).to.eq(200)
            })

        })



        it('deve exibi email ja cadastrado', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldtHaveText('Email já cadastrado para outro usuário.')


        });

    })

    context('quando o email é incorreto', function () {

        const user = {
            name: 'Eliana Sa',
            email: 'eliana.hotmail.com',
            password: 'pwd123',

        }

        it('deve exibir mensagem de alerta', () => {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')


            cy.contains('.alert-error', 'Informe um email válido')
                .should('be.visible')




        });



    })


    context('quando a senha é muita curta', function () {


        const password = ['1', '2a', '3ab', '4bcx', '5ngfd']



        beforeEach(function () {
            signupPage.go()

        })


        password.forEach(function (p) {

            it('não deve cadastrar com a senha: ' + p, () => {

                const user = {
                    name: 'Ana Sa',
                    email: 'ana@gmail.com',
                    password: p
                }



                signupPage.form(user)
                signupPage.submit()




            });




        })

        afterEach(function () {

            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })


    })


    context('quando não peencho nenhum dos campos', function () {

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){

            signupPage.go()
            signupPage.submit()

        })

        alertMessages.forEach(function(alert){

            it('deve exibir ' + alert.toLowerCase(), () => {
                signupPage.alertHaveText(alert)
            });

        })


    })


})






