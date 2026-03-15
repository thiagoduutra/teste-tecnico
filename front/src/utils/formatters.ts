function readErrorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return null;
}

export function hasHttpStatus(error: unknown, status: number) {
  return readErrorStatus(error) === status;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function normalizeApiError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const { data } = error.response as { data?: unknown };

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "mensagem" in data &&
      typeof data.mensagem === "string"
    ) {
      return data.mensagem;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      typeof data.title === "string"
    ) {
      const details =
        "errors" in data &&
        typeof data.errors === "object" &&
        data.errors !== null
          ? Object.values(data.errors as Record<string, string[]>)
              .flat()
              .join(" ")
          : "";

      return details ? `${data.title} ${details}` : data.title;
    }
  }

  const status = readErrorStatus(error);

  if (status === 404) {
    return "O endpoint solicitado não foi encontrado na API.";
  }

  if (status === 500) {
    return "A API retornou um erro interno ao processar a solicitação.";
  }

  return "Ocorreu um erro inesperado ao processar a solicitação.";
}
