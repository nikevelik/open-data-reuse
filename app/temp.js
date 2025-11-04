         const select = document.getElementById('yearSelect');

           async function makeTableAndCharts(){
             function populateSelect(summary){
               for (const year of Object.keys(summary)) {
                 const option = document.createElement('option');
                 option.value = year;
                 option.textContent = year;
                 select.appendChild(option);
               }
             }
             function configTable(summary){
               function renderTable(year) {
                     const data = summary[year];
                     if (!data || data.length === 0) { container.innerHTML = "<p>Няма данни</p>"; return; }
                     const headers = data[0];
                     const rows = data.slice(1);
                     const html = `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
                       <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
                     container.innerHTML = html;
                 }
               renderTable(Object.keys(summary)[0]);
               select.addEventListener('change', e => renderTable(e.target.value));
             }
             function configCharts(summary){
                // Charts
                const years = Object.keys(summary);
                const dat={
                  bel:{part: [], avg: []}, 
                  mat:{part: [], avg: []}
                }

                years.forEach(year => {
                  const rows = summary[year].slice(1);
                  const getNums = i => rows.map(r => parseFloat(r[i])).filter(n => !isNaN(n));
                  const [bel, mat, belPart, matPart] = [getNums(6), getNums(8), getNums(5), getNums(7)];
                  dat.bel.avg.push((bel.reduce((a,b)=>a+b,0)/bel.length || 0).toFixed(2));
                  dat.mat.avg.push((mat.reduce((a,b)=>a+b,0)/mat.length || 0).toFixed(2));
                  dat.bel.part.push(belPart.reduce((a,b)=>a+b,0));
                  dat.mat.part.push(matPart.reduce((a,b)=>a+b,0));
                });

              
                new Chart(document.getElementById('avgChart').getContext('2d'), {
                  type: 'line',
                  data: { labels: years, datasets:[
                    { label: 'Среден BEL', data: dat.bel.avg, borderColor: 'red', backgroundColor: 'transparent' },
                    { label: 'Среден MAT', data: dat.mat.avg, borderColor: 'blue', backgroundColor: 'transparent' }
                  ]},
                  options: { responsive:true, plugins:{legend:{position:'top'}},
                    scales:{ y:{beginAtZero:true, title:{display:true, text:'Среден резултат'}},
                              x:{title:{display:true,text:'Година'}} } }
                });
              
                new Chart(document.getElementById('partChart').getContext('2d'), {
                  type: 'line',
                  data: { labels: years, datasets:[
                    { label: 'Явили се BEL', data: dat.bel.part, borderColor: 'red', backgroundColor: 'transparent' },
                    { label: 'Явили се MAT', data: dat.mat.part, borderColor: 'blue', backgroundColor: 'transparent' }
                  ]},
                  options: { responsive:true, plugins:{legend:{position:'top'}},
                    scales:{ y:{ min:54000, max:61000, title:{display:true,text:'Явили се'}},
                              x:{title:{display:true,text:'Година'}} } }
                });
             }
             const summary = await Data.summary();
             configTable(summary);
             configCharts(summary);
           }
           await makeTableAndCharts();