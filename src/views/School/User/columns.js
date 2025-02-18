export const COLUMNS = () => [
    {
      Header: '',
      accessor: 'select',
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.isSelected}
          onChange={() => row.original.handleRowSelect(row.index)}
        />
      ),
    },
    {
      Header: 'SN',
      accessor: 'asasd',
      
    },
    {
      Header: 'Asset Name',
      accessor: 'name',
    },
    {
      Header: 'Device Id',
      accessor: 'deviceId',
    },
    {
      Header: 'Assets Friendly Name',
      accessor: 'data.attributes.status',
    },
    {
      Header: 'Device Description',
      accessor: 'model',
    },
    {
      Header: 'Assets Category',
      accessor: 'Vehicles',
      Cell: ()=>'Vehicle',
    },
    {
      Header: 'Assets Type',
      accessor: 'category',
    },
    {
      Header: 'Asset Registered Date',
      accessor: 'asset_registered_date',
    },
    {
      Header: 'Assets Owner',
      accessor: 'assets_owner',
    },
    {
      Header: 'Assets Division',
      accessor: 'assets_division',
    },
    {
      Header: 'Assets Group',
      accessor: 'assets_group',
    },
    {
      Header: 'Sim Number',
      accessor: 'phone',
    },
    {
      Header: 'Assets Image',
      accessor: 'assets_image',
    },
    {
      Header: 'Driver Name',
      accessor: 'driver_name',
    },
    {
      Header: 'Driver Image',
      accessor: 'driver_image',
    },
    {
      Header: 'Driver Mobile No.',
      accessor: 'contact',
    },
    {
      Header: 'Max speed Limit',
      accessor: 'max_speed_limit',
    },
  ];
  