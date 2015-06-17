module.exports = formatDataset;

function formatDataset(dataset) {
  var formattedDataset = '';

  formattedDataset += '==============\n';
  formattedDataset += dataset.title + '\n';
  formattedDataset += '==============\n';
  formattedDataset += dataset.data.reduce(formatRow, '');
  formattedDataset += '\n\n';

  function formatRow(out, row, rowIndex, rows) {
    return out + (rows.length > 1 ? '\n# ' + rowIndex : '') + '\n' + row.reduce(formatRowValues, '');
  }

  function formatRowValues(out, rowValue, rowValueIndex) {
    return out + '  ⚫ ' + dataset.header[rowValueIndex] + ' → ' + rowValue + '\n';
  }

  return formattedDataset;
}
