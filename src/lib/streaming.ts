async function* streamingFetch( url: string, init?: RequestInit): AsyncGenerator<string> {
    const response = await fetch(url, init);
    const body = response.body;
    if (body === null)
        return undefined;
    const reader = body.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield (new TextDecoder().decode(value));
    }
}

export default streamingFetch;