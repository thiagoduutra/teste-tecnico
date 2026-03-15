import { useCallback, useEffect, useRef, useState } from "react";

interface UseAsyncDataOptions {
  errorMessage?: string;
  shouldIgnoreError?: (error: unknown) => boolean;
}

export function useAsyncData<TData>(
  loader: () => Promise<TData>,
  initialData: TData,
  options?: UseAsyncDataOptions,
) {
  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialDataRef = useRef(initialData);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextData = await loader();
      setData(nextData);
    } catch (requestError) {
      // Alguns endpoints sao opcionais; nesses casos mantemos o estado inicial sem erro visual.
      if (optionsRef.current?.shouldIgnoreError?.(requestError)) {
        setData(initialDataRef.current);
        setError(null);
        return;
      }

      // Exibe a mensagem configurada pelo chamador ou a mensagem padrao do hook.
      setError(
        optionsRef.current?.errorMessage ??
          "Nao foi possivel carregar os dados da API.",
      );
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    refresh().catch(() => undefined);
  }, [refresh]);

  return { data, setData, isLoading, error, refresh };
}
