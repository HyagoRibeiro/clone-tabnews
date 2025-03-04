import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} data={data} />
      <h1>Database</h1>
      {!isLoading && data ? (
        Object.keys(data?.dependencies?.database).map((value) => (
          <DatabaseStatusRow key={value} accessKey={value} data={data} />
        ))
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  );
}

function UpdatedAt(props) {
  const { isLoading, data } = props;
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatusRow(props) {
  const { data, accessKey } = props;
  const databaseText = data?.dependencies?.database[accessKey];

  return (
    <div>
      {`${accessKey}:`} {databaseText}
    </div>
  );
}
