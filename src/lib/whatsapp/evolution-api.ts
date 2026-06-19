const EVO_API_VERSION = "v2";

interface EvoSendTextParams {
  url: string;
  apikey: string;
  instance: string;
  number: string;
  text: string;
  delay?: number;
  quoted?: { key: { id: string } };
}

interface EvoSendMediaParams {
  url: string;
  apikey: string;
  instance: string;
  number: string;
  mediatype: "image" | "video" | "document" | "audio";
  media: string;
  fileName?: string;
  caption?: string;
}

interface EvoVerifyResponse {
  instance: {
    instanceName: string;
    status: string;
    serverUrl: string;
  };
}

function evoPost(url: string, apikey: string, body: Record<string, unknown>) {
  return fetch(url, {
    method: "POST",
    headers: {
      "apikey": apikey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function verifyEvolutionConnection(
  url: string,
  apikey: string,
  instance: string,
): Promise<{ ok: true; status: string } | { ok: false; error: string }> {
  try {
    const resp = await fetch(
      `${url}/instance/fetchInstances?instanceName=${encodeURIComponent(instance)}`,
      { headers: { apikey } },
    );
    if (!resp.ok) {
      const text = await resp.text();
      return { ok: false, error: `Evolution API: ${resp.status} ${text}` };
    }
    const data = (await resp.json()) as EvoVerifyResponse[];
    const inst = data.find((i) => i.instance.instanceName === instance);
    if (!inst) {
      return { ok: false, error: `Instance "${instance}" not found` };
    }
    return { ok: true, status: inst.instance.status };
  } catch (err) {
    return { ok: false, error: `Failed to reach Evolution API: ${String(err)}` };
  }
}

export async function sendEvolutionText(params: EvoSendTextParams) {
  const body: Record<string, unknown> = {
    number: params.number,
    text: params.text,
  };
  if (params.delay) body.delay = params.delay;
  if (params.quoted) body.quoted = params.quoted;

  const resp = await evoPost(
    `${params.url}/message/sendText/${params.instance}`,
    params.apikey,
    body,
  );
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Evolution sendText failed: ${resp.status} ${err}`);
  }
  return resp.json();
}

export async function sendEvolutionMedia(params: EvoSendMediaParams) {
  const body: Record<string, unknown> = {
    number: params.number,
    mediatype: params.mediatype,
    media: params.media,
  };
  if (params.fileName) body.fileName = params.fileName;
  if (params.caption) body.caption = params.caption;

  const resp = await evoPost(
    `${params.url}/message/sendMedia/${params.instance}`,
    params.apikey,
    body,
  );
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Evolution sendMedia failed: ${resp.status} ${err}`);
  }
  return resp.json();
}

export async function sendEvolutionTemplate(
  url: string,
  apikey: string,
  instance: string,
  number: string,
  templateName: string,
  language: string,
  components?: unknown[],
) {
  const body: Record<string, unknown> = {
    number,
    templateName,
    language: language || "pt_BR",
  };
  if (components) body.components = components;

  const resp = await evoPost(
    `${url}/message/sendTemplate/${instance}`,
    apikey,
    body,
  );
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Evolution sendTemplate failed: ${resp.status} ${err}`);
  }
  return resp.json();
}
