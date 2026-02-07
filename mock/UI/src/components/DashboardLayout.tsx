/*
  This is a mock of the user interface layer of a decision support tool that aims
  to build on workflows defined in the grid situational awareness model of AISOP 
  project, see section 2.2. and fig. 2 in [Ref1]. These workflows are also 
  illustrated in the "Grid Situational Awareness Model (AISOP WP3)" block in the 
  main diagram in [Ref2], where the "Data Co-Pilot" block describes our approach
  to implement the logic to run these workflows. 


  This DashboardLayout component is a functional react component that renders a 
  dashboard with the following sections:
  - Banner: displays the title of the tool and the AISOP project logo
  - Main content: contains two columns  (Left column and Right column)
    - Left column: contains three sections
      - Workflow Selection: a dropdown to select a workflow
      - Parametric Input: displays the parameters of the selected workflow
      - Conversational Interface: a chat interface to interact with the tool
    - Right column: contains two sections
      - Data Table: a table of mock grid sensor data
      - Algorithm Output Visualization: a placeholder for algorithm output 
      visualization

  The aim of this mock is to provide a starting point for the development of the
  user interface layer of the decision support tool on two fronts.
  
  1. User experiece design and frontend development. The layout and components 
  can be customized to meet the requirements of the tool users and stakeholders.
  
  2. Prototype development and integration with backend services:
      -> logic to run the workflows,
      -> integration of the parametric input with the workflow execution,
      -> logic to fetch data,
      -> logic to display the algorithm output visualization,
      -> integration with the conversational interface, etc.

  [Ref1] https://zenodo.org/records/14636977
  [Ref2] https://zenodo.org/records/11639570
  [Ref3] https://react.dev/learn/thinking-in-react
*/
import React, { useState } from 'react';

const DashboardLayout = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [paramValues, setParamValues] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [workflowResult, setWorkflowResult] = useState(null);
  
  const workflows = [
    'Anomaly Detection',
    'Power Flow Forecast',
    'Risk Assessment',
    'Dynamic Tariff Evaluation'
  ];

  const workflowParams = {
    'Anomaly Detection': {
      params: [
        { name: 'PCA Dimensions', type: 'number', default: 3 },
        { name: 'eps', type: 'number', default: 0.5 },
        { name: 'min_samples', type: 'number', default: 5 }
      ]
    },
    'Power Flow Forecast': {
      params: [
        { 
          name: 'Method', 
          type: 'select', 
          options: ['NN', 'Ensemble', 'Näive'],
          default: 'NN'
        },
        { name: 'Forecast Horizon (hours)', type: 'number', default: 24 },
        { name: 'Start Time', type: 'datetime-local', default: new Date().toISOString().slice(0, 16) }
      ]
    }
  };

  const sampleData = [
    { 
      timestamp: '1668485000000',
      U_L1_avg: '232.38',
      U_L2_avg: '232.49',
      U_L3_avg: '232.82',
      EP_cons_L1: '1.20',
      EP_cons_L2: '1.11',
      EP_cons_L3: '1.36',
      status: 'Normal'
    },
    { 
      timestamp: '1668485300000',
      U_L1_avg: '231.09',
      U_L2_avg: '231.19',
      U_L3_avg: '231.54',
      EP_cons_L1: '1.25',
      EP_cons_L2: '1.15',
      EP_cons_L3: '1.42',
      status: 'Normal'
    },
    { 
      timestamp: '1668485600000',
      U_L1_avg: '233.39',
      U_L2_avg: '233.47',
      U_L3_avg: '233.79',
      EP_cons_L1: '1.18',
      EP_cons_L2: '1.08',
      EP_cons_L3: '1.31',
      status: 'Warning'
    }
  ];

  // Mock result generators per workflow
  const generateMockResult = (workflow, params) => {
    switch (workflow) {
      case 'Anomaly Detection':
        return {
          type: 'anomaly',
          summary: `DBSCAN clustering (eps=${params['eps'] || 0.5}, min_samples=${params['min_samples'] || 5}) on ${params['PCA Dimensions'] || 3} PCA dimensions`,
          anomalies: [
            { timestamp: '2022-11-15T06:33:20Z', score: 0.92, cluster: -1, description: 'Voltage deviation on L3 (+2.1σ)' },
            { timestamp: '2022-11-15T07:15:00Z', score: 0.87, cluster: -1, description: 'Energy consumption spike L1-L3 correlated' },
            { timestamp: '2022-11-15T09:42:00Z', score: 0.78, cluster: -1, description: 'Phase imbalance U_L1 vs U_L2 > threshold' },
          ],
          stats: { total_points: 288, anomalies_found: 3, clusters: 4 }
        };
      case 'Power Flow Forecast':
        return {
          type: 'forecast',
          summary: `${params['Method'] || 'NN'} forecast, horizon=${params['Forecast Horizon (hours)'] || 24}h`,
          forecast: [
            { hour: '+1h', P_load: 12.4, P_gen: 3.1, net_flow: 9.3 },
            { hour: '+3h', P_load: 14.8, P_gen: 5.7, net_flow: 9.1 },
            { hour: '+6h', P_load: 18.2, P_gen: 8.9, net_flow: 9.3 },
            { hour: '+12h', P_load: 22.1, P_gen: 11.2, net_flow: 10.9 },
            { hour: '+24h', P_load: 13.6, P_gen: 2.8, net_flow: 10.8 },
          ],
          metrics: { mae: 1.23, rmse: 1.87, mape: '5.4%' }
        };
      case 'Risk Assessment':
        return {
          type: 'risk',
          summary: 'Grid risk assessment based on current sensor readings',
          risks: [
            { component: 'Transformer T1', level: 'Low', probability: 0.12, impact: 'Moderate', detail: 'Thermal headroom adequate' },
            { component: 'Feeder F3', level: 'Medium', probability: 0.38, impact: 'High', detail: 'Loading approaching 85% capacity' },
            { component: 'Bus B2', level: 'High', probability: 0.71, impact: 'High', detail: 'Voltage stability margin < 5%' },
            { component: 'Line L7', level: 'Low', probability: 0.08, impact: 'Low', detail: 'Within normal operating range' },
          ],
          overall: 'Medium'
        };
      case 'Dynamic Tariff Evaluation':
        return {
          type: 'tariff',
          summary: 'Tariff optimization based on forecasted load and generation',
          periods: [
            { window: '00:00 - 06:00', tariff: 0.08, signal: 'Low', recommendation: 'Shift deferrable loads here' },
            { window: '06:00 - 09:00', tariff: 0.15, signal: 'Medium', recommendation: 'Normal operation' },
            { window: '09:00 - 17:00', tariff: 0.12, signal: 'Low-Med', recommendation: 'Solar generation offsets demand' },
            { window: '17:00 - 21:00', tariff: 0.28, signal: 'High', recommendation: 'Curtail non-essential loads' },
            { window: '21:00 - 00:00', tariff: 0.14, signal: 'Medium', recommendation: 'Battery discharge window' },
          ],
          savings_potential: '18.3%'
        };
      default:
        return null;
    }
  };

  const handleRunWorkflow = () => {
    setIsRunning(true);
    setWorkflowResult(null);
    // Simulate async workflow execution
    setTimeout(() => {
      const result = generateMockResult(selectedWorkflow, paramValues);
      setWorkflowResult(result);
      setIsRunning(false);
    }, 1500);
  };

  const riskColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-900 text-red-200';
      case 'Medium': return 'bg-yellow-900 text-yellow-200';
      case 'Low': return 'bg-green-900 text-green-200';
      default: return 'bg-gray-800 text-gray-200';
    }
  };

  const renderWorkflowOutput = () => {
    if (isRunning) {
      return (
        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg bg-black">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Running {selectedWorkflow}...</p>
        </div>
      );
    }

    if (!workflowResult) {
      return (
        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg bg-black">
          <p className="text-gray-400">Select a workflow and click "Run Workflow" to view output</p>
        </div>
      );
    }

    switch (workflowResult.type) {
      case 'anomaly':
        return (
          <div className="space-y-3 overflow-y-auto max-h-80">
            <p className="text-sm text-gray-400">{workflowResult.summary}</p>
            <div className="flex gap-4 text-sm">
              <span className="px-2 py-1 bg-gray-800 rounded">Points: {workflowResult.stats.total_points}</span>
              <span className="px-2 py-1 bg-red-900 text-red-200 rounded">Anomalies: {workflowResult.stats.anomalies_found}</span>
              <span className="px-2 py-1 bg-gray-800 rounded">Clusters: {workflowResult.stats.clusters}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">Timestamp</th>
                  <th className="text-left py-2 px-2 text-gray-400">Score</th>
                  <th className="text-left py-2 px-2 text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {workflowResult.anomalies.map((a, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 px-2 font-mono text-xs">{a.timestamp}</td>
                    <td className="py-2 px-2">
                      <span className="px-2 py-0.5 bg-red-900 text-red-200 rounded text-xs">{a.score.toFixed(2)}</span>
                    </td>
                    <td className="py-2 px-2">{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'forecast':
        return (
          <div className="space-y-3 overflow-y-auto max-h-80">
            <p className="text-sm text-gray-400">{workflowResult.summary}</p>
            <div className="flex gap-4 text-sm">
              <span className="px-2 py-1 bg-gray-800 rounded">MAE: {workflowResult.metrics.mae}</span>
              <span className="px-2 py-1 bg-gray-800 rounded">RMSE: {workflowResult.metrics.rmse}</span>
              <span className="px-2 py-1 bg-gray-800 rounded">MAPE: {workflowResult.metrics.mape}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">Horizon</th>
                  <th className="text-left py-2 px-2 text-gray-400">P_load [kW]</th>
                  <th className="text-left py-2 px-2 text-gray-400">P_gen [kW]</th>
                  <th className="text-left py-2 px-2 text-gray-400">Net Flow [kW]</th>
                  <th className="text-left py-2 px-2 text-gray-400">Balance</th>
                </tr>
              </thead>
              <tbody>
                {workflowResult.forecast.map((f, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 px-2 font-mono">{f.hour}</td>
                    <td className="py-2 px-2">{f.P_load}</td>
                    <td className="py-2 px-2">{f.P_gen}</td>
                    <td className="py-2 px-2">{f.net_flow}</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((f.P_gen / f.P_load) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-3 overflow-y-auto max-h-80">
            <p className="text-sm text-gray-400">{workflowResult.summary}</p>
            <div className="text-sm">
              Overall Grid Risk: <span className={`px-2 py-1 rounded text-xs font-semibold ${riskColor(workflowResult.overall)}`}>{workflowResult.overall}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">Component</th>
                  <th className="text-left py-2 px-2 text-gray-400">Risk</th>
                  <th className="text-left py-2 px-2 text-gray-400">Prob.</th>
                  <th className="text-left py-2 px-2 text-gray-400">Impact</th>
                  <th className="text-left py-2 px-2 text-gray-400">Detail</th>
                </tr>
              </thead>
              <tbody>
                {workflowResult.risks.map((r, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 px-2 font-medium">{r.component}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${riskColor(r.level)}`}>{r.level}</span>
                    </td>
                    <td className="py-2 px-2">{(r.probability * 100).toFixed(0)}%</td>
                    <td className="py-2 px-2">{r.impact}</td>
                    <td className="py-2 px-2 text-gray-400">{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'tariff':
        return (
          <div className="space-y-3 overflow-y-auto max-h-80">
            <p className="text-sm text-gray-400">{workflowResult.summary}</p>
            <div className="text-sm">
              Estimated Savings: <span className="px-2 py-1 bg-green-900 text-green-200 rounded text-xs font-semibold">{workflowResult.savings_potential}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-2 text-gray-400">Time Window</th>
                  <th className="text-left py-2 px-2 text-gray-400">Tariff [EUR/kWh]</th>
                  <th className="text-left py-2 px-2 text-gray-400">Signal</th>
                  <th className="text-left py-2 px-2 text-gray-400">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {workflowResult.periods.map((p, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 px-2 font-mono">{p.window}</td>
                    <td className="py-2 px-2">{p.tariff.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        p.signal === 'High' ? 'bg-red-900 text-red-200' :
                        p.signal === 'Low' ? 'bg-green-900 text-green-200' :
                        'bg-yellow-900 text-yellow-200'
                      }`}>{p.signal}</span>
                    </td>
                    <td className="py-2 px-2 text-gray-400">{p.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-gray-200">
      {/* Banner */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-2xl font-semibold">
          Operational Planning Decision Support Tool
        </h1>
        <img 
          src="/images/aisop_logo.png" 
          alt="AISOP Logo" 
          className="h-12 w-40 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex h-full gap-4">
          {/* Left Column */}
          <div className="w-1/3 flex flex-col gap-4">
            {/* Workflow Selection */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Workflow Selection</h2>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 text-left bg-black border border-gray-700 rounded-md hover:bg-gray-800"
                >
                  {selectedWorkflow || 'Select Workflow'} ▼
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute w-full mt-1 bg-black border border-gray-700 rounded-md shadow-lg z-10">
                    {workflows.map((workflow) => (
                      <button
                        key={workflow}
                        className="w-full px-4 py-2 text-left hover:bg-gray-800"
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setIsDropdownOpen(false);
                          setWorkflowResult(null);
                          setParamValues({});
                        }}
                      >
                        {workflow}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Parametric Input */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex-1">
              <h2 className="text-lg font-semibold mb-4">Parametric Input</h2>
              <div className="space-y-4">
                {selectedWorkflow && workflowParams[selectedWorkflow]?.params.map((param, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium">{param.name}</label>
                    {param.type === 'select' ? (
                      <select 
                        className="mt-1 block w-full rounded-md border-gray-700 bg-black focus:border-blue-500 focus:ring-blue-500"
                        value={paramValues[param.name] || param.default}
                        onChange={(e) => setParamValues({...paramValues, [param.name]: e.target.value})}
                      >
                        {param.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type={param.type}
                        className="mt-1 block w-full rounded-md border-gray-700 bg-black focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={param.default}
                        onChange={(e) => setParamValues({...paramValues, [param.name]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
                {!selectedWorkflow && (
                  <div className="text-gray-400 text-center py-4">
                    Select a workflow to view parameters
                  </div>
                )}
              </div>
              
              {/* Run Button 
              

              */}
              {selectedWorkflow && (
                <div className="mt-6">
                  <button 
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRunWorkflow}
                    disabled={isRunning}
                  >
                    {isRunning ? 'Running...' : 'Run Workflow'}
                  </button>
                </div>
              )}
            </div>

            {/* Conversational Interface */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex-1">
              <h2 className="text-lg font-semibold mb-4">Conversational Interface</h2>
              <div className="h-64 border border-gray-700 rounded-md p-2 mb-4 overflow-y-auto bg-black">
                <div className="space-y-2">
                  <div className="bg-gray-800 p-2 rounded-lg max-w-xs">How can I help you today?</div>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="..." 
                  className="flex-1 rounded-md border-gray-700 bg-black focus:border-blue-500 focus:ring-blue-500" 
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Send</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-2/3 flex flex-col gap-4">
            {/* Data Table mock of grid sensor data that measures power quality at trafo 
               
              TODO: Replace this mock with data 
                * fetched from the backend API
                * or from a database, or file system 
            */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 flex-1">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Data Visualization</h2>
              </div>
              
              <table className="w-full">
                <thead>
                  <tr className="bg-black">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Timestamp (UTC)</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">U_L1 [V]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">U_L2 [V]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">U_L3 [V]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">EP_L1 [kWh]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">EP_L2 [kWh]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">EP_L3 [kWh]</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-black'}>
                      <td className="px-6 py-4 text-sm">{new Date(parseInt(row.timestamp)).toISOString()}</td>
                      <td className="px-6 py-4 text-sm">{row.U_L1_avg}</td>
                      <td className="px-6 py-4 text-sm">{row.U_L2_avg}</td>
                      <td className="px-6 py-4 text-sm">{row.U_L3_avg}</td>
                      <td className="px-6 py-4 text-sm">{row.EP_cons_L1}</td>
                      <td className="px-6 py-4 text-sm">{row.EP_cons_L2}</td>
                      <td className="px-6 py-4 text-sm">{row.EP_cons_L3}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Normal' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Algorithm Output Visualization */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex-1">
              <h2 className="text-lg font-semibold mb-4">
                Algorithm Output
                {workflowResult && (
                  <span className="text-sm font-normal text-gray-400 ml-2">— {selectedWorkflow}</span>
                )}
              </h2>
              {renderWorkflowOutput()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;