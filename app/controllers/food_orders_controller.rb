class FoodOrdersController < ApplicationController
  layout 'admin'
  http_basic_authenticate_with :name => ENV['ADMIN_USERNAME'], :password => ENV['ADMIN_PASSWORD']

  # GET /food_orders
  # GET /food_orders.json
  def index
    @food_orders = FoodOrder.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @food_orders }
    end
  end

  # GET /food_orders/1
  # GET /food_orders/1.json
  def show
    @food_order = FoodOrder.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @food_order }
    end
  end

  # GET /food_orders/new
  # GET /food_orders/new.json
  def new
    @food_order = FoodOrder.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @food_order }
    end
  end

  # GET /food_orders/1/edit
  def edit
    @food_order = FoodOrder.find(params[:id])
  end

  # POST /food_orders
  # POST /food_orders.json
  def create
    @food_order = FoodOrder.new(params[:food_order])

    respond_to do |format|
      if @food_order.save
        format.html { redirect_to @food_order, notice: "#{FoodOrder.model_name.human.capitalize} was successfully created." }
        format.json { render json: @food_order, status: :created, location: @food_order }
      else
        format.html { render action: "new" }
        format.json { render json: @food_order.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /food_orders/1
  # PUT /food_orders/1.json
  def update
    @food_order = FoodOrder.find(params[:id])

    respond_to do |format|
      if @food_order.update_attributes(params[:food_order])
        format.html { redirect_to @food_order, notice: "#{FoodOrder.model_name.human.capitalize} was successfully updated." }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @food_order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /food_orders/1
  # DELETE /food_orders/1.json
  def destroy
    @food_order = FoodOrder.find(params[:id])
    @food_order.destroy

    respond_to do |format|
      format.html { redirect_to food_orders_url }
      format.json { head :no_content }
    end
  end
end
