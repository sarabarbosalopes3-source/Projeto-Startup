import os
from google import genai


def perguntar_ao_gemini(pergunta, contexto):

    chave = os.getenv("GEMINI_API_KEY")

    if not chave:
        raise ValueError("Chave da API Gemini não configurada.")

    cliente = genai.Client(api_key=chave)

    instrucao = f"""
Você é o assistente inteligente do sistema Controle de Estoque | Projeto - Startups, especializado
em controle e gerenciamento de estoque.

REGRAS:
- Responda sempre em português brasileiro.
- Seja claro, direto e educado.
- Utilize os dados reais fornecidos no contexto.
- Não invente quantidades, produtos ou movimentações.
- Se não encontrar uma informação, explique isso ao usuário.
- Ajude a identificar produtos que precisam de reposição.
- Considere estoque baixo quando o saldo for menor ou igual
  ao estoque mínimo.

DADOS ATUAIS DO ESTOQUE:
{contexto}

PERGUNTA DO USUÁRIO:
{pergunta}
"""

    resposta = cliente.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=instrucao
    )

    return resposta.text
