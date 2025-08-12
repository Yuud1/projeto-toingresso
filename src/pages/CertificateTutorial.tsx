import { Card } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface CertificateTutorialProps {
  onProceed: () => void
}

export default function CertificateTutorial({ onProceed }: CertificateTutorialProps) {
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl border rounded-lg">
      <h1 className="text-3xl font-bold mb-2 text-center">Tutorial Passo a Passo</h1>
      <h2 className="text-xl text-gray-600 mb-8 text-center">
        Como Criar um PDF com Campos Substituíveis para Certificados
      </h2>

      <Alert className="bg-red-50 border-red-200 mb-8">
        <AlertTitle className="text-red-800 font-bold">ATENÇÃO IMPORTANTE</AlertTitle>
        <AlertDescription className="text-red-700">
          A assinatura do certificado é de total responsabilidade do cliente. Você deve incluir sua própria assinatura
          no modelo do certificado antes de convertê-lo para PDF.
        </AlertDescription>
      </Alert>

      <div className="space-y-12">
        <section>
          <h3 className="text-2xl font-semibold mb-4">Passo 1: Preparar o Documento</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>Primeiro, você precisa criar um novo documento onde o certificado será desenhado:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Abra o Microsoft Word, Google Docs ou outro editor de texto</li>
                <li>Configure a página para orientação paisagem (horizontal)</li>
                <li>Defina as margens adequadas (recomendado: 2cm em todos os lados)</li>
                <li>Escolha um tamanho de papel adequado (geralmente A4)</li>
              </ol>
            </div>
                         <Card className="p-4 bg-gray-50">
               <img
                 src="/configuração da pagina.png"
                 alt="Configuração da página"
                 className="w-3/4 h-auto border border-gray-300 mx-auto"
               />
               <p className="text-sm text-center mt-2 text-gray-600">
                 Exemplo: Configuração da página em orientação paisagem
               </p>
             </Card>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Passo 2: Criar o Design do Certificado</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>Agora, crie o design básico do seu certificado:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Adicione uma borda decorativa (opcional)</li>
                <li>Insira o título "CERTIFICADO" no topo</li>
                <li>Adicione o logotipo da sua empresa/instituição</li>
                <li>Crie espaço para o texto principal</li>
                <li>Adicione áreas para assinaturas e datas</li>
              </ol>
            </div>
            <Card className="p-4 bg-gray-50">
              <div className="border-2 border-gray-300 p-4 text-center">
                <h4 className="text-xl font-serif mb-4">CERTIFICADO</h4>
                <div className="h-32 flex items-center justify-center border border-dashed border-gray-400 mb-4">
                  <p className="text-gray-500">Área para texto principal</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-t border-gray-400 pt-1 text-sm">Assinatura</div>
                  <div className="border-t border-gray-400 pt-1 text-sm">Assinatura</div>
                </div>
              </div>
              <p className="text-sm text-center mt-2 text-gray-600">Exemplo: Layout básico do certificado</p>
            </Card>
          </div>
        </section>

        <section className="bg-yellow-50 p-6 border-l-4 border-yellow-500">
          <h3 className="text-2xl font-semibold mb-4 text-yellow-800">
            Passo 3: Adicionar sua Assinatura ao Certificado
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="font-bold text-yellow-800">
                A ASSINATURA É DE SUA TOTAL RESPONSABILIDADE como cliente. Você tem três opções:
              </p>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Assinatura Digital:</strong> Escaneie sua assinatura e insira-a como imagem no documento
                </li>
                <li>
                  <strong>Assinatura Eletrônica:</strong> Use ferramentas como DocuSign ou Adobe Sign para adicionar uma
                  assinatura eletrônica
                </li>
                <li>
                  <strong>Espaço para Assinatura Manual:</strong> Deixe um espaço em branco com uma linha e seu nome
                  abaixo para assinar manualmente após a impressão
                </li>
              </ol>
              <div className="bg-yellow-100 p-3 border border-yellow-300 rounded">
                <p className="text-yellow-800 font-bold">IMPORTANTE:</p>
                <p className="text-yellow-800">
                  Sua assinatura deve estar presente no PDF final antes de enviá-lo para processamento. O sistema não
                  adicionará assinaturas automaticamente.
                </p>
              </div>
            </div>
            <Card className="p-4 bg-gray-50">
              <div className="border-2 border-gray-300 p-4">
                <div className="mb-4 text-center">
                  <p className="text-sm mb-2">Exemplo de área de assinatura:</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                                         <div className="h-20 border border-dashed border-gray-400 flex items-center justify-center">
                       <img
                         src="/assinatura.png"
                         alt="Exemplo de assinatura"
                         className="h-16 opacity-70"
                       />
                     </div>
                    <div className="border-t border-gray-400 pt-1 text-center">
                      <p className="text-sm">Dr. João Silva</p>
                      <p className="text-xs text-gray-500">Diretor</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center mt-4 text-red-600">
                  ⚠️ Você deve adicionar sua própria assinatura antes de finalizar o PDF
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Passo 4: Adicionar o Texto com Campos Substituíveis</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>Agora, adicione o texto principal com os campos substituíveis:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Clique na área destinada ao texto principal</li>
                <li>Digite o texto do certificado, incluindo os campos substituíveis</li>
                <li>
                  Use <strong>exatamente</strong> os seguintes campos:
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      <code className="bg-yellow-100 px-1 rounded">#nome_do_participante</code>
                    </li>
                  </ul>
                </li>
                <li>Formate o texto (tamanho, fonte, espaçamento) conforme desejado</li>
              </ol>
              <div className="bg-red-50 border-l-4 border-red-500 p-3">
                <p className="text-red-700 text-sm">
                  <strong>ATENÇÃO:</strong> Os campos devem ser escritos exatamente como mostrado, incluindo o símbolo #
                  e todas as letras minúsculas.
                </p>
              </div>
            </div>
            <Card className="p-4 bg-gray-50">
              <div className="border-2 border-gray-300 p-4 text-center">
                <p className="mb-4">Certificamos que</p>
                <p className="text-lg font-bold text-blue-600 mb-4">#nome_do_participante</p>
                <p className="mb-4">participou com êxito do evento</p>
                <p>realizado nos dias 10 e 11 de junho de 2023, com carga horária total de 16 horas.</p>
              </div>
              <p className="text-sm text-center mt-2 text-gray-600">Exemplo: Texto com campos substituíveis</p>
            </Card>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Passo 5: Salvar como PDF</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>Finalmente, salve seu documento como PDF:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Clique em "Arquivo" no menu superior</li>
                <li>Selecione "Salvar como" ou "Exportar"</li>
                <li>Escolha o formato PDF</li>
                <li>Dê um nome ao arquivo (ex: "modelo_certificado")</li>
                <li>Escolha o local onde deseja salvar</li>
                <li>Clique em "Salvar" ou "Exportar"</li>
              </ol>
            </div>
                         <Card className="p-4 bg-gray-50 flex flex-col justify-center">
               <img
                 src="/salvarPdf.png"
                 alt="Diálogo de salvar como PDF"
                 className="w-full h-auto border border-gray-300"
               />
               <p className="text-sm text-center mt-2 text-gray-600">Exemplo: Diálogo de salvar como PDF</p>
             </Card>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Passo 6: Verificar o PDF Final</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p>Antes de enviar, verifique se o PDF está correto:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Abra o PDF que você acabou de criar</li>
                <li>
                  Verifique se o campo <code className="bg-yellow-100 px-1 rounded">#nome_do_participante</code> está visível e escrito
                  corretamente
                </li>
                <li>
                  <strong className="text-red-600">
                    Confirme se sua assinatura está presente e visível no documento
                  </strong>
                </li>
                <li>Confirme se o layout está como esperado</li>
                <li>Verifique se todas as fontes estão incorporadas corretamente</li>
                <li>Certifique-se de que o PDF pode ser aberto em diferentes dispositivos</li>
              </ol>
            </div>
            <Card className="p-4 bg-gray-50">
              <div className="border-2 border-gray-300 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                      ✓
                    </div>
                    <span className="text-sm">Campos corretos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                      ✓
                    </div>
                    <span className="text-sm">Assinatura presente</span>
                  </div>
                </div>
                <div className="border border-dashed border-gray-400 p-3 text-center">
                  <p className="text-sm">Visualização do PDF final com o campo:</p>
                  <p className="text-xs text-blue-600 mt-2">#nome_do_participante</p>
                  <p className="text-xs text-red-600 mt-2">✓ Assinatura verificada</p>
                </div>
              </div>
              <p className="text-sm text-center mt-2 text-gray-600">Exemplo: Verificação final do PDF</p>
            </Card>
          </div>
        </section>
      </div>

      <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-green-800">Resumo dos Pontos Importantes</h3>
        <ul className="list-disc pl-5 space-y-3">
          <li>
            Use <strong>exatamente</strong> os campos{" "}
            <code className="bg-green-100 px-1 rounded">#nome_do_participante</code>
          </li>
          <li>Não altere a grafia dos campos (mantenha o # e as letras minúsculas)</li>
          <li className="font-bold text-red-700">
            A assinatura é de SUA RESPONSABILIDADE e deve ser incluída no PDF antes de enviá-lo
          </li>
          <li>Certifique-se de que o PDF está bem formatado e legível</li>
          <li>Verifique se os campos estão posicionados corretamente</li>
          <li>Guarde uma cópia do arquivo original para futuras edições</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Seguindo estes passos, seu certificado estará pronto para ser usado no sistema de geração automática.
        </p>
        <Button onClick={onProceed} size="lg" className="cursor-pointer">
          Entendi, Ir para o Gerador
        </Button>
      </div>
    </div>
  )
}