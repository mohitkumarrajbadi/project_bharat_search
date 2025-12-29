interface Props {
  loading: boolean;
  data: any;
}

export const FeatureInsights = ({ loading, data }: Props) => {
  if (loading) return <p>Loading...</p>;
  if (!data) return null;
  if (data.error) return <p>{data.error}</p>;

  return (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
