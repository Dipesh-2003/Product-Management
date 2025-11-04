package com.aurionpro.app.service;

import java.io.Writer;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import com.aurionpro.app.dto.ProductDto;
import com.aurionpro.app.model.Product;

@Service
public class CsvExportService {

	public void writeProductsToCsv(Writer writer, List<ProductDto>products) {
		try(CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
				.withHeader("Product ID", 	"Name","Description","Category ID"))){
			for(ProductDto product : products) {
				csvPrinter.printRecord(
						product.getProductId(),
						product.getName(),
						product.getDescription(),
						product.getCategoryId()
						);
			}
		}catch (Exception e) {
			// TODO: handle exception
			throw new RuntimeException("Failed to write CSV file",e);
		}
	}
}
