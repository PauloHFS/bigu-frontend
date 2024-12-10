import { GoBack } from '@/components';
import React from 'react';

const Ajuda = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="bg-gray-800 flex items-center space-x-2">
            <GoBack/>
        </header>
        <h1 className="text-3xl font-bold mb-6 text-center font-[Poppins]">Página de Ajuda</h1>
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-cinza">
              <h2 className="text-lg font-semibold mb-2 font-[Poppins]">{item.question}</h2>
              <p className="text-gray-300 font-[Poppins]">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a
             className="bg-light-blue text-white py-3 px-6 rounded-lg text-lg font-medium font-[Poppins] hover:bg-light-blue-dark transition-colors flex justify-center items-center sm:text-center"
             style={{ position: 'relative', bottom: 'unset', margin: 'auto', textAlign:'center' }}
          >
            Ainda tem mais alguma dúvida? Contate nosso Suporte, clicando aqui!
          </a>
        </div>
      </main>
      <footer className="bg-gray-800 text-gray-400 text-center p-4 mt-12 font-[Poppins]">
        <p>Política de privacidade | Termos de uso</p>
        <p>&copy; 2023 Bluq. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

const faqData = [
  {
    question: 'Sou obrigado a pagar/cobrar pelas minhas caronas?',
    answer: 'Não há obrigação de pagar ou cobrar pelas caronas no aplicativo. No entanto, é considerado uma boa prática que os passageiros se ofereçam para contribuir com os custos de combustível. Da mesma forma, incentivamos os motoristas a oferecerem caronas independentemente de compensação financeira, valorizando o fortalecimento de laços, o networking, e a contribuição para um transporte mais sustentável.'
  },
  {
    question: 'Me tiraram de uma carona sem explicação, posso fazer algo?',
    answer: 'Embora ninguém seja obrigado a oferecer ou aceitar caronas, entendemos que o cancelamento inesperado pode causar transtornos. Caso a carona seja cancelada sem explicação ou em cima da hora, você pode relatar o ocorrido ao nosso suporte, que tomará as devidas providências.'
  },
  {
    question: 'O motorista foi grosseiro comigo, me tratou mal, ou dirigiu de maneira imprudente, o que posso fazer?',
    answer: 'Se você se sentiu maltratado(a) ou percebeu uma conduta imprudente por parte do motorista, pode registrar uma denúncia diretamente no aplicativo. Nosso sistema de denúncias permite que você relate comportamentos inapropriados, e investigaremos todas as reclamações para garantir um ambiente seguro e respeitoso para todos.'
  },
  {
    question: 'O que devo fazer se o motorista ou passageiro não aparecer?',
    answer: 'Caso o motorista ou passageiro não compareça no horário combinado, você pode utilizar o sistema de denúncias disponível no histórico de viagens. A falha em comparecer repetidamente pode resultar em penalidades para o usuário faltoso.'
  },
  {
    question: 'O que faço se me atrasar ou precisar cancelar uma carona?',
    answer: 'Em caso de atraso ou necessidade de cancelamento, recomendamos que você informe o motorista ou passageiro via chat com pelo menos uma hora de antecedência. Não é garantida tolerância para atrasos, uma vez que os usuários geralmente têm compromissos com horários fixos, como aulas na universidade.'
  },
  {
    question: 'Posso escolher com quem vou compartilhar a carona?',
    answer: 'Sim, o motorista tem o direito de escolher os passageiros com quem deseja compartilhar a carona. Além disso, oferecemos uma opção para que mulheres motoristas ofereçam caronas exclusivamente para outras mulheres, caso assim desejem. Os passageiros podem solicitar caronas, mas a decisão final é do motorista.'
  },
  {
    question: 'Qual o procedimento se houver um acidente durante a carona?',
    answer: 'Em caso de acidente, os procedimentos são os mesmos aplicados em qualquer situação de trânsito. Sugerimos que siga as orientações legais e contate as autoridades competentes. Nosso desejo é que todos tenham uma viagem segura, mas, caso algo ocorra, o processo deve ser conduzido conforme as leis de trânsito.'
  },
  {
    question: 'Como a segurança dos usuários é garantida?',
    answer: 'Embora não possamos garantir completamente a segurança dos usuários, todos os participantes são verificados como alunos ou professores da UFCG. Recomendamos que os usuários entrem em contato via chat antes da carona e, quando possível, busquem referências de terceiros sobre motoristas ou passageiros com quem pretendem viajar. Nossa prioridade é fomentar uma comunidade confiável e segura.'
  }
];

export default Ajuda;
